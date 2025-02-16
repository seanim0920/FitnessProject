import { PanGesture } from "react-native-gesture-handler"
import { usePanGesture } from "../DraggableView/usePanGesture"
import { Target } from "./types"
import { useDragContext } from "./useDragContext"

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

export const useDraggableContext = () => {
  return useDragContext({
    isDraggable: true,
    dragContextExtension: ({ target, hoverGesture }) =>
      usePanGesture(
        {
          x: target.measurements.value.x,
          y: target.measurements.value.y
        },
        hoverGesture
      )
  })
}
