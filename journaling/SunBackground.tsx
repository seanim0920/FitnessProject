import {
  Circle,
  Group,
  LinearGradient,
  RadialGradient,
  Rect,
  SkSize,
  vec
} from "@shopify/react-native-skia"
import { useEffect } from "react"
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated"
import { EdgeInsets } from "react-native-safe-area-context"
import { MovingCloudsDrawing, cloud } from "./Clouds"

export type SunBackgroundProps = {
  size: SkSize
  edgeInsets: EdgeInsets
}

const CORE_RADIUS = 48
const OUTER_RING_RADIUS = 56
const FADE_RING_RADIUS = 64
const FADE_RING_TARGET_RADIUS = 80

const CLOUDS_1 = [
  cloud({
    relativeX: 0.6,
    relativeY: 0.1,
    relativeRangeX: 0.1,
    scale: 0.3,
    speed: 30_000
  }),
  cloud({
    relativeX: 0.4,
    relativeY: 0.15,
    relativeRangeX: 0.15,
    scale: 0.5,
    speed: 23_000
  }),
  cloud({
    relativeX: 0.6,
    relativeY: 0.17,
    relativeRangeX: 0.15,
    scale: 0.55,
    speed: 21_000
  }),
  cloud({
    relativeX: 0.03,
    relativeY: 0.23,
    relativeRangeX: 0.2,
    scale: 0.7,
    speed: 16_000
  }),
  cloud({
    relativeX: 0.2,
    relativeY: 0.26,
    relativeRangeX: 0.25,
    scale: 0.8,
    speed: 12_000
  })
]

export const SunBackgroundDrawing = ({
  edgeInsets,
  size
}: SunBackgroundProps) => {
  const sunX = FADE_RING_RADIUS + 24
  const sunY = edgeInsets.top + FADE_RING_RADIUS
  const ringRadius = useSharedValue(FADE_RING_RADIUS)
  const ringOpacity = useSharedValue(0)
  useEffect(() => {
    ringRadius.value = withRepeat(
      withTiming(FADE_RING_TARGET_RADIUS, {
        duration: 3500,
        easing: Easing.linear
      }),
      -1,
      false
    )
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(1.0, {
          duration: 1000,
          easing: Easing.linear
        }),
        withTiming(0, {
          duration: 2500,
          easing: Easing.linear
        })
      ),
      -1,
      true
    )
  }, [ringRadius, ringOpacity])
  return (
    <Group>
      <Rect width={size.width} height={size.height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(size.width, size.height)}
          colors={["#3AC4F7", "#6AA5F2", "#9589F7"]}
        />
      </Rect>
      <Circle cx={sunX} cy={sunY} r={CORE_RADIUS}>
        <RadialGradient
          c={{ x: sunX, y: sunY }}
          r={CORE_RADIUS}
          colors={["#FFFCF0", "#FCF0BE", "#FAEAA5", "#F9E48C"]}
          positions={[0.5, 0.75, 0.9, 1]}
        />
      </Circle>
      <Circle
        cx={sunX}
        cy={sunY}
        r={OUTER_RING_RADIUS}
        color="#FBE277"
        style="stroke"
        strokeWidth={4}
      />
      <Circle
        cx={sunX}
        cy={sunY}
        r={ringRadius}
        color="#FBE277"
        style="stroke"
        opacity={ringOpacity}
        strokeWidth={4}
      />
      <MovingCloudsDrawing size={size} clouds={CLOUDS_1} />
    </Group>
  )
}
