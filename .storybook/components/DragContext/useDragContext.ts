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
  isHovering: boolean
  hoverGesture: PanGesture
}

export type UseDragContextArgs<T = void> = {
  dragContextExtension?: (args: DragContextExtensionArgs) => T
}

type DragState<T> = {
  isHovering: boolean
  onLayout: (event: LayoutChangeEvent) => void
  extension: T
}

const DEFAULT_MEASUREMENT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const useDragContext = <TExtension = void>({
  dragContextExtension
}: UseDragContextArgs<TExtension> = {}): DragState<TExtension> => {
  const { registerTarget, unregisterTarget, hoveredTargets, hoverGesture } =
    useContext(DragContext)

  const targetId = useRef<string>(uuidString())

  const isHovering = hoveredTargets.some(
    (target) => target.id === targetId.current
  )

  const measurements = useSharedValue<Measurements>(DEFAULT_MEASUREMENT)

  const target: Target = {
    id: targetId.current,
    measurements
  }

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    measurements.value = event.nativeEvent.layout
  }, [])

  useEffect(() => {
    registerTarget(target)

    return () => {
      unregisterTarget(targetId.current)
    }
  }, [])

  return {
    isHovering,
    onLayout,
    extension: dragContextExtension?.({
      target,
      hoveredTargets,
      isHovering,
      hoverGesture
    }) as TExtension
  }
}
