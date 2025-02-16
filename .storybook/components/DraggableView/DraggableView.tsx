import React from 'react';
import { useWindowDimensions, ViewProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle
} from 'react-native-reanimated';
import { Point } from '../DragContext/types';
import { usePanGesture } from "./usePanGesture";

type DraggableViewProps = ViewProps & {
  initialPosition?: Point;
}

export const DraggableView = ({
  initialPosition,
  children,
  style,
}: DraggableViewProps) => {
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
    <GestureDetector gesture={panGesture}>
      <Animated.View 
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