import React, { useState } from 'react';
import { StyleProp, Text, ViewProps, ViewStyle } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { DraggableView } from '../DraggableView/DraggableView';
import { useDraggableContext } from "./useDraggableContext";

export type DraggableTargetProps = ViewProps & {
  activeStyle?: StyleProp<ViewStyle>;
};

export const DraggableTarget = ({ 
  activeStyle,
  style,
  ...props 
}: DraggableTargetProps) => {
  const { extension: {panGesture, panPosition, isPanning} } = useDraggableContext();
  const [isDragging, setIsDragging] = useState(false)

  useAnimatedReaction(
    () => isPanning.value,
    (currentValue) => {
      runOnJS(setIsDragging)(currentValue);
    }
  );

  return (
    <DraggableView
      draggable={{panGesture, panPosition}}
      style={[
        style,
        isDragging && activeStyle
      ]}
      {...props}
    >
      <Text>Drag me!</Text>
    </DraggableView>
  );
}