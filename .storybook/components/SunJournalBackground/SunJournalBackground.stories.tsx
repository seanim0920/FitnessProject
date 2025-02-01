import React, { useEffect, useMemo, useState } from "react"
import { View, Text } from "react-native"
import { StoryMeta } from "storybook/HelperTypes"
import { Canvas, SkSize } from "@shopify/react-native-skia"
import {
  MID_DAY_SKY_GRADIENT,
  MID_DAY_SUN_GRADIENT,
  MORNING_DAY_SUN_GRADIENT,
  MORNING_SKY_GRADIENT,
  SUNRISE_SKY_GRADIENT,
  SUNSET_SKY_GRADIENT,
  SUNSET_SUN_GRADIENT,
  SunBackground,
  SunBackgroundDrawing,
  sunRelativePosition
} from "@journaling/SunBackground"
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated"
import {
  SafeAreaProvider,
  useSafeAreaInsets
} from "react-native-safe-area-context"
import { cloud } from "@journaling/Clouds"

export const SunJournalBackgroundMeta: StoryMeta = {
  title: "SunJournalBackground"
}

export default SunJournalBackgroundMeta

export const Basic = () => (
  <SafeAreaProvider>
    <CanvasView />
  </SafeAreaProvider>
)

const CLOUDS = [
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

const BACKGROUND: SunBackground = {
  sun: {
    relativePosition: sunRelativePosition(0),
    gradient: MORNING_DAY_SUN_GRADIENT
  },
  skyGradient: SUNRISE_SKY_GRADIENT,
  // skyGradient: MORNING_DAY_SUN_GRADIENT,
  clouds: CLOUDS
}

const CanvasView = () => {
  const [size, setSize] = useState<SkSize>({ width: 0, height: 0 })
  const insets = useSafeAreaInsets()
  const [backgroundX, setBackgroundX] = useState(0.3)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setBackgroundX((x) => (x >= 1 ? 0 : x + 0.1))
  //   }, 500)
  //   return () => clearInterval(interval)
  // }, [])
  const background = useMemo(
    () => ({
      sun: {
        relativePosition: sunRelativePosition(backgroundX),
        gradient: MID_DAY_SUN_GRADIENT
      },
      skyGradient: MORNING_SKY_GRADIENT,
      clouds: CLOUDS
    }),
    [backgroundX]
  )
  return (
    <Canvas style={{ flex: 1 }} onLayout={(e) => setSize(e.nativeEvent.layout)}>
      <SunBackgroundDrawing
        size={size}
        background={background}
        edgeInsets={insets}
      />
    </Canvas>
  )
}
