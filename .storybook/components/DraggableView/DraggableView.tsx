import React from 'react';
import { LayoutChangeEvent, ViewProps } from 'react-native';
import { GestureDetector, PanGesture } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';

export type Draggable = {
  onLayout?: (event: LayoutChangeEvent) => void;
  panGesture: PanGesture;
  panPosition: {
      x: SharedValue<number>;
      y: SharedValue<number>;
  };
}

export const DraggableView = ({
  children,
  style,
  draggable: {onLayout, panGesture, panPosition}
}: ViewProps & {draggable: Draggable}) => {
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