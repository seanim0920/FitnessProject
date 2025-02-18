import React from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { useCollisionContext } from "./useCollisionContext";
import { Target } from '../HoverContext/types';

type AnimatedCollidingTargetProps = ViewProps & {
  animatedPosition: SharedValue<{ x: number; y: number }>;
  onCollide?: (targets: Target[]) => void;
}

export const AnimatedCollidingTarget = ({
  children,
  style,
  animatedPosition,
  onCollide,
  ...props
}: AnimatedCollidingTargetProps) => {
  const { onLayout, onAnimatedLayoutChange } = useCollisionContext({onCollide})

  const animatedStyle = useAnimatedStyle(() => {
    const position = animatedPosition.value;
    onAnimatedLayoutChange(position);

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y }
      ]
    }
  });

  return (
    <Animated.View
      onLayout={onLayout}
      style={[style, animatedStyle]}
      {...props}
    >
      {children}
    </Animated.View>
  )
}