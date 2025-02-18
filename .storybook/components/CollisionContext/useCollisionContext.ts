import { useContext, useEffect, useRef, useState } from "react"
import { LayoutChangeEvent } from "react-native"
import {
  runOnJS,
  runOnUI,
  SharedValue,
  useSharedValue
} from "react-native-reanimated"
import { uuidString } from "../../../lib/utils/UUID"
import { Measurements, Target } from "../HoverContext/types"
import { areArraysEqual } from "../HoverContext/utils"
import { CollisionContext } from "./CollisionContext"

type DragState = {
  onLayout: (event: LayoutChangeEvent) => void
  onAnimatedLayoutChange: (layout: Partial<Measurements>) => void
  collidingTargets: Target[]
}

export const DEFAULT_MEASUREMENT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const useCollisionContext = ({
  onCollide
}: {
  onCollide?: (collidingTargets: Target[]) => void
}): DragState => {
  const context = useContext(CollisionContext)
  if (!context) {
    throw new Error(
      "useCollisionContext must be used inside a CollisionProvider"
    )
  }

  const { registerTarget, unregisterTarget, checkCollidingTargets } = context

  const targetId = useRef<string>(uuidString())

  const measurements = useSharedValue<Measurements>(DEFAULT_MEASUREMENT)

  const target: Target = {
    id: targetId.current,
    measurements
  }

  const [collidingTargets, setCollidingTargets] = useState<Target[]>([target])

  const updateCollidingTargets = (
    updatedMeasurements: SharedValue<Measurements>
  ) => {
    "worklet"
    const newCollidingTargets = checkCollidingTargets(updatedMeasurements)

    if (!areArraysEqual(collidingTargets, newCollidingTargets)) {
      runOnJS(setCollidingTargets)(newCollidingTargets)
      if (onCollide) {
        runOnJS(onCollide)(newCollidingTargets)
      }
    }
  }

  const onLayout = (event: LayoutChangeEvent) => {
    measurements.value = event.nativeEvent.layout
    runOnUI(updateCollidingTargets)(measurements)
  }

  const onAnimatedLayoutChange = (layout: Partial<Measurements>) => {
    "worklet"
    measurements.value = {
      ...measurements.value,
      ...layout
    }

    updateCollidingTargets(measurements)
  }

  useEffect(() => {
    registerTarget(target)

    return () => {
      unregisterTarget(targetId.current)
    }
  }, [])

  return {
    onLayout,
    onAnimatedLayoutChange,
    collidingTargets
  }
}
