import React from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle
} from 'react-native-reanimated';
import { usePanGesture } from "../DraggableView/usePanGesture";
import { DragTargetProps } from "./DragTarget";
import { useDragContext } from './useDragContext';

type DraggableTargetProps = DragTargetProps

export const DraggableTarget = ({
  children,
  style,
}: DraggableTargetProps) => {
  const {onLayout, panGesture, panPosition} = useDragContext({
    dragContextExtension: ({target, hoverGesture}) => usePanGesture({
      x: target.measurements.value.x,
      y: target.measurements.value.y,
    }, hoverGesture)
  })

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
        onLayout={onLayout}
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