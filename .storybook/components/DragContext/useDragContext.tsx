import { useCallback, useContext, useEffect, useRef } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { DragContext, Target } from './DragContext';
import type { Measurements } from './utils';

export type UseDragContextExtensionArgs = {targetMeta: Pick<Target, "id" | "isToken">, hoveredTargets: Target[], isHovered: boolean}

export type UseDragContextArgs = {
  isToken?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  useDragContextExtension?: (args: UseDragContextExtensionArgs) => void
};

export const useDragContext = ({ 
  isToken = false,
  onHoverStart,
  onHoverEnd,
  useDragContextExtension
}: UseDragContextArgs = {}) => {
  const { registerTarget, unregisterTarget, hoveredTargets } = useContext(DragContext);
  const idRef = useRef<string>(Math.random().toString(36).slice(2, 9));
  const measurementsRef = useRef<Measurements>();

  const isHovered = hoveredTargets.some(target => target.id === idRef.current);

  useEffect(() => {
    if (isHovered) {
      onHoverStart?.();
    } else {
      onHoverEnd?.();
    }
  }, [isHovered, onHoverStart, onHoverEnd]);

  useEffect(() => {
    return () => {
      unregisterTarget(idRef.current);
    };
  }, [unregisterTarget]);
  
  useDragContextExtension?.({targetMeta: {id: idRef.current, isToken}, isHovered, hoveredTargets})

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    measurementsRef.current = {
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
    };

    registerTarget({
      id: idRef.current,
      measurements: measurementsRef.current,
      isToken
    });
  }, [registerTarget, isToken]);

  return {
    isHovered,
    onLayout,
  };
};