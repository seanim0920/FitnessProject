// DragContext.tsx
import React, { useCallback, useContext, useRef } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { DragContext } from './DragContext';

export const useDragContext = ({ onHoverChange }: { onHoverChange?: (isHovered: boolean) => void } = {}) => {
  const { registerTarget, unregisterTarget } = useContext(DragContext);
  const idRef = useRef<string>(Math.random().toString(36).substr(2, 9));
  const [isHovered, setIsHovered] = React.useState(false);

  // Handle component unmount
  React.useEffect(() => {
    return () => {
      unregisterTarget(idRef.current);
    };
  }, [unregisterTarget]);

  // Handle layout changes
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    registerTarget(
      idRef.current,
      {
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
      },
      (hovering) => {
        setIsHovered(hovering);
        onHoverChange?.(hovering);
      }
    );
  }, [registerTarget, onHoverChange]);

  return {
    isHovered,
    onLayout,
  };
};
