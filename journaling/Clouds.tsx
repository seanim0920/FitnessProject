import React, { useEffect } from "react"
import { Circle, Group, SkSize } from "@shopify/react-native-skia"
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated"
import { uuidString } from "@lib/utils/UUID"

export type Cloud = {
  id: string
  relativeX: number
  relativeY: number
  relativeRangeX: number
  scale: number
  speed: number
}

export const cloud = (values: Omit<Cloud, "id">) => {
  const id = uuidString()
  return { ...values, id }
}

export type CloudProps = {
  cloud: Cloud
  size: SkSize
  initialProgress: number
}

/**
 * A single cloud made of overlapping circles,
 * animated to move from right to left.
 */
export const CloudDrawing = ({ size, cloud, initialProgress }: CloudProps) => {
  const progress = useSharedValue(initialProgress)
  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: cloud.speed }),
        withTiming(0, { duration: cloud.speed })
      ),
      Infinity,
      true
    )
  }, [progress, cloud.speed])
  const transform = useDerivedValue(() => {
    const baseX = size.width * cloud.relativeX
    const range = size.width * cloud.relativeRangeX
    const end = baseX + range
    const x = baseX + progress.value * (end - baseX)
    return [
      { translateX: x },
      { translateY: size.height * cloud.relativeY },
      { scale: cloud.scale }
    ]
  }, [progress, cloud, size])
  return (
    <Group transform={transform}>
      <Circle cx={30} cy={15} r={30} color="white" />
      <Circle cx={80} cy={15} r={40} color="white" />
      <Circle cx={130} cy={15} r={30} color="white" />
    </Group>
  )
}

export type MovingCloudsProps = {
  size: SkSize
  clouds: Cloud[]
}

/**
 * Renders multiple clouds at varying scales/heights,
 * so smaller/higher clouds appear “farther” away.
 */
export const MovingCloudsDrawing = ({ size, clouds }: MovingCloudsProps) => (
  <Group>
    {clouds.map((c, i) => (
      <CloudDrawing
        key={c.id}
        initialProgress={(i + 1) / clouds.length}
        size={size}
        cloud={c}
      />
    ))}
  </Group>
)
