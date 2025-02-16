import { useMemo } from "react"
import { Gesture } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"
import { Point } from "../DragContext/types"

export const usePanGesture = (initialPosition?: Point) => {
  const panX = useSharedValue(initialPosition?.x ?? 0)
  const panY = useSharedValue(initialPosition?.y ?? 0)

  const startX = useSharedValue(0)
  const startY = useSharedValue(0)

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          "worklet"
          startX.value = panX.value
          startY.value = panY.value
        })
        .onUpdate(({ translationX, translationY }) => {
          "worklet"
          panX.value = startX.value + translationX
          panY.value = startY.value + translationY
        }),
    []
  )

  return {
    panGesture,
    panPosition: {
      x: panX,
      y: panY
    }
  }
}
