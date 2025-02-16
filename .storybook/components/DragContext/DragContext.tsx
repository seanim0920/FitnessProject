import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import type { Target } from "./types";
import { isPointInTarget, remove, upsert } from "./utils";

export const DragContext = createContext<{
  registerTarget: (target: Target) => void;
  unregisterTarget: (id: string) => void;
  hoveredTargets: Target[];
  hoverGesture: PanGesture,
}>({
  registerTarget: () => {},
  unregisterTarget: () => {},
  hoveredTargets: [],
  hoverGesture: Gesture.Pan()
});

const INTERSECTION_BUFFER = 10

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [registeredTargetsState, setRegisteredTargetsState] = useState<Target[]>([]); // NB: Needed to effectively update the shared value on mount / avoid race conditions
  const registeredTargets = useSharedValue<Target[]>([]);
  const [hoveredTargets, setHoveredTargets] = useState<Target[]>([]);
  const hoveredIdsShared = useSharedValue<string[]>([]);

  useEffect(() => {
    registeredTargets.value = registeredTargetsState;
  }, [registeredTargetsState]);

  const clearHoveredTargets = () => {
    'worklet';
    hoveredIdsShared.value = [];
    runOnJS(setHoveredTargets)([]);
  };

  const updateHoveredTargets = ({absoluteX: x, absoluteY: y}: { absoluteX: number; absoluteY: number }) => {
    'worklet';    
    const currentIdsSet = new Set(hoveredIdsShared.value);
    const newHoveredIds = new Set<string>();
    
    for (const target of registeredTargets.value) {
      if (isPointInTarget({ x, y }, target.measurements.value, INTERSECTION_BUFFER)) {
        newHoveredIds.add(target.id);
      }
    }
  
    if (currentIdsSet.size !== newHoveredIds.size) {
      const newIdsArray = Array.from(newHoveredIds);
      hoveredIdsShared.value = newIdsArray;
      runOnJS(setHoveredTargets)(
        registeredTargets.value.filter(target => newHoveredIds.has(target.id))
      );
      return;
    }
  
    for (const id of currentIdsSet) {
      if (!newHoveredIds.has(id)) {
        const newIdsArray = Array.from(newHoveredIds);
        hoveredIdsShared.value = newIdsArray;
        runOnJS(setHoveredTargets)(
          registeredTargets.value.filter(target => newHoveredIds.has(target.id))
        );
        return;
      }
    }
  };

  const hoverGesture = Gesture.Pan()
    .onBegin(updateHoveredTargets)
    .onUpdate(updateHoveredTargets)
    .onFinalize(clearHoveredTargets);

  return (
    <DragContext.Provider value={{
      registerTarget: (target: Target) => {
        setRegisteredTargetsState(prev => upsert(prev, target))
      },
      unregisterTarget: (id: string) => {
        setRegisteredTargetsState(prev => remove(prev, id))
      },
      hoveredTargets,
      hoverGesture
    }}>
      <GestureDetector gesture={hoverGesture}>
        <Animated.View style={{ flex: 1 }}>
          {children}
        </Animated.View>
      </GestureDetector>
    </DragContext.Provider>
  );
};