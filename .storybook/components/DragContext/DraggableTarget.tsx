import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle
} from 'react-native-reanimated';
import { usePanGesture } from "../DraggableView/usePanGesture";
import { DragTarget, DragTargetProps } from "./DragTarget";
import { Point } from './types';

type DraggableTargetProps = DragTargetProps & {
  initialPosition?: Point;
}

export const DraggableTarget = ({
  initialPosition,
  children,
  ...props
}: DraggableTargetProps) => {
  const { width, height } = useWindowDimensions();
  const {panGesture, panPosition} = usePanGesture({
    x: initialPosition?.x ?? width / 2 - 50,
    y: initialPosition?.y ?? height / 2 - 50,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: panPosition.x.value },
        { translateY: panPosition.y.value },
      ],
    };
  });

  return (
    <Animated.View 
      style={[
        animatedStyle
      ]}
    >
      <DragTarget dragContextArgs={{panGesture}} {...props}>
        {children}
      </DragTarget>
    </Animated.View>
  );
};