
import React, { useEffect, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { DragFeature } from '../DragContext/DragContext';

type DragAndDropTargetProps = ViewProps & {
  onHoverChange?: (isHovered: boolean) => void;
};

// on hover, add this to the context
export const DragAndDropToken = ({ onHoverChange = () => {}, style, ...props }: DragAndDropTargetProps) => {
  ...
};