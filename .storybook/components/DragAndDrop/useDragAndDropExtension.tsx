import { useEffect, useRef, useState } from 'react';
import { DragContextExtensionArgs } from '../DragContext/useDragContext';

export const useDragAndDropExtension = ({hoveredTargets, isHovered}: DragContextExtensionArgs) => {
  const wasDraggableHoveringRef = useRef(false);
  const [wasDraggableOverlapping, setWasDraggableOverlapping] = useState(false);

  const isDraggableHovering = hoveredTargets.some(target => target.isDraggable);

  const isDraggableOverlapping = hoveredTargets.length >= 2 && 
    isDraggableHovering &&
    isHovered;

  useEffect(() => {
    if (isDraggableOverlapping) {
      setWasDraggableOverlapping(true);
    }
  }, [isDraggableOverlapping]);

  useEffect(() => {
    wasDraggableHoveringRef.current = isDraggableHovering;
  }, [isDraggableHovering]);

  useEffect(() => {
    if (hoveredTargets.length === 0) {
      setWasDraggableOverlapping(false);
    }
  }, [hoveredTargets.length, wasDraggableOverlapping]);

  const isSelected = hoveredTargets.length === 0 && wasDraggableOverlapping;

  return {
    isDraggableHovering,
    isDraggableOverlapping,
    isSelected,
  };
};