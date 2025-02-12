import React, { ReactNode, createContext, useCallback, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import { Measurements, findIntersectingTargets } from "./utils";

type Target = {
  id: string;
  onHoverChange: (isHovered: boolean) => void;
  measurements: Measurements;
};

type DragContextType = {
  registerTarget: (
    id: string,
    measurements: Target['measurements'],
    onHoverChange: (isHovered: boolean) => void
  ) => void;
  unregisterTarget: (id: string) => void;
  hoveredTargets: string[];
};

export const DragContext = createContext<DragContextType>({
  registerTarget: () => {},
  unregisterTarget: () => {},
  hoveredTargets: [],
});

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const hoveredTargetIds = useSharedValue<string[]>([]);
  const [hoveredTargets, setHoveredTargets] = useState<string[]>([]);

  const registerTarget = useCallback((
    id: string,
    measurements: Measurements,
    onHoverChange: (isHovered: boolean) => void
  ) => {
    const newTarget = { id, measurements, onHoverChange };
    setTargets(prev => {
      const targetIndex = prev.findIndex(t => t.id === id);
      if (targetIndex >= 0) {
        const newTargets = [...prev];
        newTargets[targetIndex] = newTarget;
        return newTargets;
      }
      return [...prev, newTarget];
    });
  }, []);

  const unregisterTarget = useCallback((id: string) => {
    setTargets(prev => prev.filter(target => target.id !== id));
  }, []);

  const updateHoveredTargets = useCallback((newHoveredIds: string[]) => {
    setHoveredTargets(newHoveredIds);
    targets.forEach(target => {
      const isCurrentlyHovered = newHoveredIds.includes(target.id);
      target.onHoverChange(isCurrentlyHovered);
    });
  }, [targets]);

  const handleGestureEvent = (event: { absoluteX: number; absoluteY: number }) => {
    'worklet';
    const point = { x: event.absoluteX, y: event.absoluteY };
    const newHoveredIds = findIntersectingTargets(point, targets);
    
    if (JSON.stringify(newHoveredIds) !== JSON.stringify(hoveredTargetIds.value)) {
      hoveredTargetIds.value = newHoveredIds;
      runOnJS(updateHoveredTargets)(newHoveredIds);
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(handleGestureEvent)
    .onUpdate(handleGestureEvent)
    .onFinalize(() => {
      'worklet';
      hoveredTargetIds.value = [];
      runOnJS(updateHoveredTargets)([]);
    });

  const contextValue = React.useMemo(() => ({
    registerTarget,
    unregisterTarget,
    hoveredTargets,
  }), [registerTarget, unregisterTarget, hoveredTargets]);

  return (
    <DragContext.Provider value={contextValue}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{ flex: 1 }}>
          {children}
        </Animated.View>
      </GestureDetector>
    </DragContext.Provider>
  );
};