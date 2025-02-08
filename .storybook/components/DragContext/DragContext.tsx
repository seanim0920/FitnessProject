import React, { ReactNode, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import { featureContext } from '../../../lib/FeatureContext';

type Target = {
  ref: React.RefObject<View>;
  onHoverChange: (isHovered: boolean) => void;
  measurements: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const DragFeature = featureContext<{
  registerTarget: (ref: React.RefObject<View>, onHoverChange: (isHovered: boolean) => void) => void;
}>({
  registerTarget: () => {},
});

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const currentHoveredId = useSharedValue<number>(-1);
  
  const registerTarget = useCallback((ref: React.RefObject<View>, onHoverChange: (isHovered: boolean) => void) => {
    if (ref.current) {
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        const newTarget = {
          ref,
          onHoverChange,
          measurements: {
            x: pageX,
            y: pageY,
            width,
            height,
          },
        };
        setTargets(prev => [...prev, newTarget]);
      });
    }
  }, []);

  const notifyTargetChange = useCallback((targetId: number, isHovered: boolean) => {
    if (targetId >= 0 && targetId < targets.length) {
      targets[targetId].onHoverChange(isHovered);
    }
  }, [targets]);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      'worklet';
      // Find first intersected target
      for (let i = 0; i < targets.length; i++) {
        const { x, y, width, height } = targets[i].measurements;
        if (
          event.absoluteX >= x &&
          event.absoluteX <= x + width &&
          event.absoluteY >= y &&
          event.absoluteY <= y + height
        ) {
          currentHoveredId.value = i;
          runOnJS(notifyTargetChange)(i, true);
          break;
        }
      }
    })
    .onUpdate((event) => {
      'worklet';
      let foundTarget = -1;
      
      // Find current intersected target
      for (let i = 0; i < targets.length; i++) {
        const { x, y, width, height } = targets[i].measurements;
        if (
          event.absoluteX >= x &&
          event.absoluteX <= x + width &&
          event.absoluteY >= y &&
          event.absoluteY <= y + height
        ) {
          foundTarget = i;
          break;
        }
      }

      // Only notify if target changed
      if (foundTarget !== currentHoveredId.value) {
        if (currentHoveredId.value !== -1) {
          runOnJS(notifyTargetChange)(currentHoveredId.value, false);
        }
        if (foundTarget !== -1) {
          runOnJS(notifyTargetChange)(foundTarget, true);
        }
        currentHoveredId.value = foundTarget;
      }
    })
    .onFinalize(() => {
      'worklet';
      if (currentHoveredId.value !== -1) {
        runOnJS(notifyTargetChange)(currentHoveredId.value, false);
        currentHoveredId.value = -1;
      }
    });

  return (
    <DragFeature.Provider registerTarget={registerTarget}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{ flex: 1 }}>
          {children}
        </Animated.View>
      </GestureDetector>
    </DragFeature.Provider>
  );
};