import React, { createContext, ReactNode, useCallback, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { isPointInTarget, Measurements, remove, upsert } from "./utils";

export type Target = {
  id: string;
  measurements: Measurements;
  isToken: boolean;
};

type DragContextType = {
  registerTarget: (target: Target) => void;
  unregisterTarget: (id: string) => void;
  hoveredTargets: Target[];
};

export const DragContext = createContext<DragContextType>({
  registerTarget: () => {},
  unregisterTarget: () => {},
  hoveredTargets: [],
});

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [registeredTargets, setRegisteredTargets] = useState<Target[]>([]);
  const [hoveredTargets, setHoveredTargets] = useState<Target[]>([]);

  const registerTarget = useCallback((target: Target) => {
    setRegisteredTargets(prev => upsert(prev, target));
  }, []);

  const unregisterTarget = useCallback((id: string) => {
    setRegisteredTargets(prev => remove(prev, id));
  }, []);

  const onPanEnd = () => {
    'worklet';
    runOnJS(setHoveredTargets)([]);
  };

  const onPan = (event: { absoluteX: number; absoluteY: number }, success?: boolean) => {
    'worklet';
    
    const point = { x: event.absoluteX, y: event.absoluteY };
    
    runOnJS(setHoveredTargets)(registeredTargets.filter((target) => isPointInTarget(point, target.measurements)));
  };

  const contextValue = React.useMemo(() => ({
    registerTarget,
    unregisterTarget,
    hoveredTargets,
  }), [registerTarget, unregisterTarget, hoveredTargets]);

  return (
    <DragContext.Provider value={contextValue}>
      <GestureDetector gesture={Gesture.Pan()
        .onBegin(onPan)
        .onUpdate(onPan)
        .onFinalize(onPanEnd)}
      >
        <Animated.View style={{ flex: 1 }}>
          {children}
        </Animated.View>
      </GestureDetector>
    </DragContext.Provider>
  );
};