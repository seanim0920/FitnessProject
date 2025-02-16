import { uuidString } from "@lib/utils/UUID"
import { useCallback, useContext, useEffect, useRef } from "react"
import { LayoutChangeEvent } from "react-native"
import { PanGesture } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"
import { DragContext } from "./DragContext"
import { Measurements, Target } from "./types"

export type DragContextExtensionArgs = {
  target: Target
  hoveredTargets: Target[]
  isHovered: boolean
}

export type UseDragContextArgs<T = void> = {
  dragContextExtension?: (args: DragContextExtensionArgs) => T
  panGesture?: PanGesture
}

const DEFAULT_MEASUREMENT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const useDragContext = <TExtension = void>({
  dragContextExtension,
  panGesture
}: UseDragContextArgs<TExtension> = {}) => {
  const { registerTarget, unregisterTarget, hoveredTargets, hoverGesture } =
    useContext(DragContext)

  const isDraggable = !!panGesture
  const targetId = useRef<string>(uuidString())

  const isHovered = hoveredTargets.some(
    (target) => target.id === targetId.current
  )

  const measurements = useSharedValue<Measurements>(DEFAULT_MEASUREMENT)

  const target: Target = {
    id: targetId.current,
    measurements,
    isDraggable
  }

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    measurements.value = event.nativeEvent.layout
  }, [])

  useEffect(() => {
    console.log("trying to register target ", target.id)
    registerTarget(target)

    return () => {
      unregisterTarget(targetId.current)
    }
  }, [isDraggable])

  return {
    isHovered,
    onLayout,
    dragGesture: panGesture
      ? hoverGesture.simultaneousWithExternalGesture(panGesture)
      : hoverGesture,
    ...dragContextExtension?.({ target, hoveredTargets, isHovered })
  }
}
