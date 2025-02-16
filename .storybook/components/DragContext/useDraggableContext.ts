import { usePanGesture } from "../DraggableView/usePanGesture"
import { useDragContext } from "./useDragContext"

export const useDraggableContext = () => {
  return useDragContext({
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
