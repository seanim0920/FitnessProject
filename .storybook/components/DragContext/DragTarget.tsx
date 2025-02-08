
import React, { useEffect, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { DragFeature } from './DragContext';

type DragTargetProps = ViewProps & {
  onHoverChange?: (isHovered: boolean) => void;
};

export const DragTarget = ({ onHoverChange = () => {}, style, ...props }: DragTargetProps) => {
  const { registerTarget } = DragFeature.useContext();
  const ref = useRef<View>(null);
  
  useEffect(() => {
    registerTarget(ref, onHoverChange);
  }, []);

  return <View ref={ref} style={style} {...props} />;
};