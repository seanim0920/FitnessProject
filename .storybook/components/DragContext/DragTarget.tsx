import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useDragContext } from "./useDragContext";

type DragTargetProps = Omit<ViewProps, 'style'> & {
  onHoverChange?: (isHovered: boolean) => void;
  activeStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const DragTarget = ({ 
  onHoverChange,
  activeStyle,
  style,
  ...props 
}: DragTargetProps) => {
  const { onLayout, isHovered } = useDragContext({ onHoverChange });

  return (
    <View
      onLayout={onLayout}
      style={[
        style,
        isHovered && activeStyle
      ]}
      {...props} 
    />
  );
};