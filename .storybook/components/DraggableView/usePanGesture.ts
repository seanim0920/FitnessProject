import { Gesture, PanGesture } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"
import { Point } from "../DragContext/types"

export const usePanGesture = (
  initialPosition?: Point,
  externalGesture?: PanGesture
) => {
  const panX = useSharedValue(initialPosition?.x ?? 0)
  const panY = useSharedValue(initialPosition?.y ?? 0)
  const isPanning = useSharedValue(false)

  const startX = useSharedValue(0)
  const startY = useSharedValue(0)

  let panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet"
      startX.value = panX.value
      startY.value = panY.value
      isPanning.value = true
    })
    .onUpdate(({ translationX, translationY }) => {
      "worklet"
      panX.value = startX.value + translationX
      panY.value = startY.value + translationY
    })
    .onEnd(() => {
      "worklet"
      isPanning.value = false
    })
    .onFinalize(() => {
      "worklet"
      isPanning.value = false
    })

  if (externalGesture) {
    panGesture = panGesture.simultaneousWithExternalGesture(externalGesture)
  }

  return {
    panGesture,
    panPosition: {
      x: panX,
      y: panY
    },
    isPanning
  }
}
