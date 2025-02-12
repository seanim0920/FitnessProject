
import React, { useEffect, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { DragFeature } from '../DragContext/DragContext';

type DragAndDropTargetProps = ViewProps & {
  onHoverChange?: (isHovered: boolean) => void;
};

// has listeners for token hover, token pick up, token drop
export const DragAndDropTarget = ({ onHoverChange = () => {}, style, ...props }: DragAndDropTargetProps) => {
  ...
};