import React, { useEffect, useMemo, useState } from "react"
import { View, Text } from "react-native"
import { StoryMeta } from "storybook/HelperTypes"
import { Canvas, SkSize } from "@shopify/react-native-skia"
import { SunBackground, SunBackgroundDrawing } from "@journaling/SunBackground"
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
import { dateRange } from "TiFShared/domain-models/FixedDateRange"

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

const SUNRISE_DATE = new Date("2025-02-12T06:30:00")
const SUNSET_DATE = new Date("2025-02-12T16:30:00")
const DAY_RANGE = dateRange(SUNRISE_DATE, SUNSET_DATE)!

const CanvasView = () => {
  const [size, setSize] = useState<SkSize>({ width: 0, height: 0 })
  const insets = useSafeAreaInsets()
  const [time, setTime] = useState(0.5)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((x) => (x >= 1 ? 0 : x + 0.1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  const background = useMemo(
    () => ({ time, dayRange: DAY_RANGE, clouds: CLOUDS }),
    [time]
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
