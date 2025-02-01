import {
  AnimatedProp,
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
import { Cloud, MovingCloudsDrawing, cloud } from "./Clouds"

export type SunBackgroundColor = string

export type SunGradient = [
  SunBackgroundColor,
  SunBackgroundColor,
  SunBackgroundColor,
  SunBackgroundColor
]

export type SkyGradient = SunBackgroundColor[]

export type SunBackground = {
  sun: {
    relativePosition: { x: number; y: number }
    gradient: SunGradient
  }
  skyGradient: SkyGradient
  clouds: Cloud[]
}

export const sunRelativePosition = (x: number) => {
  return { x, y: Math.sin(3.125 * x) * 0.175 }
}

export const MID_DAY_SUN_GRADIENT: SunGradient = [
  "#FFFCF0",
  "#FCF0BE",
  "#FAEAA5",
  "#F9E48C"
]

export const MORNING_DAY_SUN_GRADIENT: SunGradient = [
  "#FEDA6F",
  "#FBBC6B",
  "#F9AE6A",
  "#F89F68"
]

export const SUNSET_SUN_GRADIENT: SunGradient = [
  "#FEB16F",
  "#F59861",
  "#F18C5B",
  "#ED7F54"
]

export const MID_DAY_SKY_GRADIENT: SkyGradient = [
  "#3FADFB",
  "#6CACFF",
  "#3183FD"
]

export const AFTERNOON_SKY_GRADIENT: SkyGradient = [
  "#438AEF",
  "#266DCD",
  "#0A50AB"
]

export const MORNING_SKY_GRADIENT: SkyGradient = [
  "#17D0F9",
  "#24B7FB",
  "#319EFD"
]

export const SUNRISE_SKY_GRADIENT: SkyGradient = [
  "#FF7040",
  "#F57A86",
  "#65C5F6",
  "#9ADDFA"
]

export const SUNSET_SKY_GRADIENT: SkyGradient = [
  "#F7482E",
  "#EC54B6",
  "#0C52BA"
]

export type SunBackgroundProps = {
  size: SkSize
  background: SunBackground
  edgeInsets: EdgeInsets
}

const CORE_RADIUS = 48
const OUTER_RING_RADIUS = 56
const FADE_RING_RADIUS = 64
const FADE_RING_TARGET_RADIUS = 80

export const SunBackgroundDrawing = ({
  edgeInsets,
  background,
  size
}: SunBackgroundProps) => {
  const POSITIONS = [
    [vec(-size.width * 1.35, size.height / 2), vec(size.width, size.height)],
    [vec(-size.width * 0.65, size.height * 0.35), vec(size.width, size.height)],
    [vec(size.width / 2, 0), vec(size.width / 2, size.height)],
    [],
    [
      vec(-size.width * 1.35, size.height / 2),
      vec(size.width * 1.75, size.height)
    ]
  ]
  return (
    <Group>
      <Rect width={size.width} height={size.height}>
        <LinearGradient
          // start={vec(-size.width * 1.35, size.height / 2)}
          start={POSITIONS[1][0]}
          // end={vec(size.width, size.height)}
          end={POSITIONS[1][1]}
          // transform={[{ translateX: size.width }, { scaleX: -1 }]}
          colors={background.skyGradient}
          positions={[0.3, 0.45, 0.8, 1]}
        />
      </Rect>
      <SunDrawing sun={background.sun} size={size} edgeInsets={edgeInsets} />
      <MovingCloudsDrawing size={size} clouds={background.clouds} />
    </Group>
  )
}

export type SunProps = {
  sun: SunBackground["sun"]
  size: SkSize
  edgeInsets: EdgeInsets
}

export const SunDrawing = ({ sun, size, edgeInsets }: SunProps) => {
  const insetSize = {
    width: size.width - edgeInsets.left - edgeInsets.right,
    height: size.height - edgeInsets.top - edgeInsets.bottom
  }
  const topInsetHeightDiff = size.height - (size.height - edgeInsets.top)
  const insetAspectRatio = insetSize.width / insetSize.height
  // console.log("a", insetAspectRatio)
  const relativeY = sun.relativePosition.y * insetAspectRatio
  const sunX = size.width * sun.relativePosition.x
  const sunY =
    edgeInsets.top +
    FADE_RING_RADIUS +
    topInsetHeightDiff -
    insetSize.height * relativeY
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
      <Circle cx={sunX} cy={sunY} r={CORE_RADIUS}>
        <RadialGradient
          c={{ x: sunX, y: sunY }}
          r={CORE_RADIUS}
          colors={sun.gradient}
          positions={[0.5, 0.75, 0.9, 1]}
        />
      </Circle>
      <Circle
        cx={sunX}
        cy={sunY}
        r={OUTER_RING_RADIUS}
        color={sun.gradient[3]}
        style="stroke"
        strokeWidth={4}
      />
      <Circle
        cx={sunX}
        cy={sunY}
        r={ringRadius}
        color={sun.gradient[3]}
        style="stroke"
        opacity={ringOpacity}
        strokeWidth={4}
      />
    </Group>
  )
}
