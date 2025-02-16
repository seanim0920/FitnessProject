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
  hoverGesture: PanGesture
}

export type UseDragContextArgs<T = void> = {
  dragContextExtension?: (args: DragContextExtensionArgs) => T
  isDraggable?: boolean
}

type BaseReturnType = {
  isHovered: boolean
  onLayout: (event: LayoutChangeEvent) => void
}

const DEFAULT_MEASUREMENT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const useDragContext = <TExtension = void>({
  dragContextExtension,
  isDraggable = false
}: UseDragContextArgs<TExtension> = {}): BaseReturnType & TExtension => {
  const { registerTarget, unregisterTarget, hoveredTargets, hoverGesture } =
    useContext(DragContext)

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
    ...dragContextExtension?.({
      target,
      hoveredTargets,
      isHovered,
      hoverGesture
    })
  } as BaseReturnType & TExtension
}
