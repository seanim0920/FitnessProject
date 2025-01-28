import React, { useState } from "react"
import { View, Text } from "react-native"
import { StoryMeta } from "storybook/HelperTypes"
import { Canvas, SkSize } from "@shopify/react-native-skia"
import { SunBackgroundDrawing } from "@journaling/SunBackground"
import { useSharedValue } from "react-native-reanimated"
import {
  SafeAreaProvider,
  useSafeAreaInsets
} from "react-native-safe-area-context"

export const SunJournalBackgroundMeta: StoryMeta = {
  title: "SunJournalBackground"
}

export default SunJournalBackgroundMeta

export const Basic = () => (
  <SafeAreaProvider>
    <CanvasView />
  </SafeAreaProvider>
)

const CanvasView = () => {
  const [size, setSize] = useState<SkSize>({ width: 0, height: 0 })
  const insets = useSafeAreaInsets()
  return (
    <Canvas style={{ flex: 1 }} onLayout={(e) => setSize(e.nativeEvent.layout)}>
      <SunBackgroundDrawing size={size} edgeInsets={insets} />
    </Canvas>
  )
}
