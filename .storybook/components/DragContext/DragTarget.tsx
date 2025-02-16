import React from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDragContext } from './useDragContext';

export type DragTargetProps = ViewProps & {
  activeStyle?: StyleProp<ViewStyle>;
};

export const DragTarget = ({ 
  activeStyle,
  style,
  ...props 
}: DragTargetProps) => {
  const { onLayout, isHovering } = useDragContext();

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        style,
        isHovering && activeStyle
      ]}
      {...props} 
    />
  );
}