import React from 'react';
import { LayoutChangeEvent, ViewProps } from 'react-native';
import { GestureDetector, PanGesture } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { Measurements } from '../HoverContext/types';

export type Draggable = {
  onLayout?: (event: LayoutChangeEvent) => void;
  onAnimatedLayoutChange?: (layout: Partial<Measurements>) => void
  panGesture: PanGesture;
  panPosition: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
}

export const DraggableView = ({
  children,
  style,
  draggable: {onLayout, onAnimatedLayoutChange, panGesture, panPosition}
}: ViewProps & {draggable: Draggable}) => {
  const initialLayoutX = useSharedValue<number>(0);
  const initialLayoutY = useSharedValue<number>(0);

  useAnimatedReaction(
    () => ({
      x: panPosition.x.value,
      y: panPosition.y.value
    }),
    (currentPosition, previousPosition) => {
      onAnimatedLayoutChange?.({
        x: initialLayoutX.value + (currentPosition.x - (previousPosition?.x ?? 0)),
        y: initialLayoutY.value + (currentPosition.y - (previousPosition?.y ?? 0)),
      });
    }
  );

  const handleInitialLayout = (event: LayoutChangeEvent) => {
    initialLayoutX.value = event.nativeEvent.layout.x;
    initialLayoutY.value = event.nativeEvent.layout.y;
    onLayout?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: panPosition.x.value },
        { translateY: panPosition.y.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View 
        onLayout={handleInitialLayout}
        style={[
          style,
          animatedStyle
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};