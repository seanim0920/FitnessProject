import { useEffect, useRef, useState } from 'react';
import { UseDragContextExtensionArgs } from '../DragContext/useDragContext';

export type UseDragAndDropContextProps = {
  onTokenDrag?: () => void;
  onTokenDrop?: () => void;
};

export const useDragAndDropContext = ({
  onTokenDrag,
  onTokenDrop,
}: UseDragAndDropContextProps = {}) => 
  ({targetMeta: {id, isToken}, hoveredTargets, isHovered}: UseDragContextExtensionArgs) => {
    if (isToken) {
      console.log("registered target ", id)
      console.log("hovered targets ", hoveredTargets)
    }

    const wasTokenHoveringRef = useRef(false);
    const [wasTokenOverlapping, setWasTokenOverlapping] = useState(false);

    const isTokenHovering = hoveredTargets.some(target => target.isToken);

    const isTokenOverlapping = hoveredTargets.length >= 2 && 
      isTokenHovering &&
      isHovered;

    useEffect(() => {
      if (isTokenOverlapping) {
        setWasTokenOverlapping(true);
      }
    }, [isTokenOverlapping]);

    useEffect(() => {
      if (isTokenHovering && !wasTokenHoveringRef.current) {
        onTokenDrag?.();
      } else if (!isTokenHovering && wasTokenHoveringRef.current) {
        onTokenDrop?.();
      }
      wasTokenHoveringRef.current = isTokenHovering;
    }, [isTokenHovering, onTokenDrag, onTokenDrop]);

    useEffect(() => {
      if (hoveredTargets.length === 0) {
        setWasTokenOverlapping(false);
      }
    }, [hoveredTargets.length, wasTokenOverlapping]);

    const isSelected = hoveredTargets.length === 0 && wasTokenOverlapping;

    return {
      isTokenHovering,
      isTokenOverlapping,
      isSelected,
    };
  };