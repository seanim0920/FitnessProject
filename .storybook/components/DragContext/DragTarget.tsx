import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useDragContext, UseDragContextArgs } from './useDragContext';

export type DragTargetProps = ViewProps & {
  activeStyle?: StyleProp<ViewStyle>;
  dragContextArgs?: UseDragContextArgs;
};

export const DragTarget = ({ 
  activeStyle,
  style,
  dragContextArgs,
  ...props 
}: DragTargetProps) => {
  const { onLayout, isHovered } = useDragContext(dragContextArgs);

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
}