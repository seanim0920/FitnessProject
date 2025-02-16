import { useEffect, useState } from "react"
import { PanGesture } from "react-native-gesture-handler"
import { SharedValue } from "react-native-reanimated"
import { useDragContext } from "../DragContext/useDragContext"
import { useDraggableContext } from "../DragContext/useDraggableContext"

type DragAndDropOption = {
  isSelecting: boolean
  onLayout: () => void
}

type DragAndDropToken = {
  isDragging: boolean
  dragGesture: PanGesture
  tokenPosition: {
    x: SharedValue<number>
    y: SharedValue<number>
  }
}

type DragAndDrop<T extends readonly string[]> = {
  [K in T[number]]: DragAndDropOption
} & {
  token: DragAndDropToken
}

export const useDragAndDrop = <const T extends readonly string[]>(
  options: T
): DragAndDrop<T> => {
  const {
    extension: {
      isPanning: { value: isDragging },
      panGesture: dragGesture,
      panPosition: tokenPosition
    }
  } = useDraggableContext()

  const dragAndDropOptions = options.reduce<
    Partial<{ [K in T[number]]: DragAndDropOption }>
  >((acc, option) => {
    const { isHovering, onLayout } = useDragContext()
    const [isSelecting, setIsSelecting] = useState(false)

    useEffect(() => {
      if (isDragging) {
        if (isHovering) {
          setIsSelecting(true)
        } else {
          setIsSelecting(false)
        }
      }
    }, [isDragging, isHovering])

    return {
      ...acc,
      [option]: {
        isSelecting,
        onLayout
      } as DragAndDropOption
    }
  }, {})

  return {
    ...dragAndDropOptions,
    token: {
      isDragging,
      dragGesture,
      tokenPosition
    }
  } as DragAndDrop<T>
}
