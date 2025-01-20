import React, { useRef, useState, useCallback } from "react"
import {
  View,
  Dimensions,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutRectangle
} from "react-native"
import MapView, { Marker, Region } from "react-native-maps"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  SharedValue
} from "react-native-reanimated"
import { Portal } from "@gorhom/portal"
import { withTiFDefaultSpring } from "@lib/Reanimated"
import { TouchableIonicon } from "./common/Icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type MapSnippetProps = {
  region: Region
  style?: StyleProp<ViewStyle>
}

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

/**
 * A snippet of a map with an expand button that
 * transitions to a full-screen map using Reanimated.
 */
export const MapSnippetView = ({ region, style }: MapSnippetProps) => {
  const snippetRef = useRef<View>(null)
  const [snippetLayout, setSnippetLayout] = useState<
    LayoutRectangle | undefined
  >()
  const [portalVisible, setPortalVisible] = useState(false)
  const progress = useSharedValue(0)
  const isExpanding = useSharedValue(false)
  const expand = useCallback(() => {
    if (!snippetRef.current) return
    snippetRef.current.measure((_, __, width, height, pageX, pageY) => {
      setSnippetLayout({ x: pageX, y: pageY, width, height })
      isExpanding.value = true
      progress.value = 0
      setPortalVisible(true)
      progress.value = withTiFDefaultSpring(1)
    })
  }, [progress, isExpanding])
  const collapse = useCallback(() => {
    isExpanding.value = false
    progress.value = withTiFDefaultSpring(0, (finished) => {
      "worklet"
      if (finished) {
        runOnJS(setPortalVisible)(false)
      }
    })
  }, [progress, isExpanding])
  return (
    <View style={style}>
      <View style={styles.container}>
        <View ref={snippetRef} style={styles.snippetContainer}>
          <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
            <Marker coordinate={region} />
          </MapView>
          <TouchableIonicon
            icon={{ name: "contract" }}
            onPress={expand}
            activeOpacity={0.8}
            style={styles.expandButton}
          />
        </View>
        {snippetLayout && (
          <PortalView
            isVisible={portalVisible}
            region={region}
            onCollapsed={collapse}
            isExpanding={isExpanding}
            progress={progress}
            layout={snippetLayout}
          />
        )}
      </View>
    </View>
  )
}

type PortalProps = {
  progress: SharedValue<number>
  isExpanding: SharedValue<boolean>
  layout: LayoutRectangle
  isVisible: boolean
  region: Region
  onCollapsed: () => void
}

const PortalView = ({
  layout,
  isVisible,
  onCollapsed,
  region,
  progress,
  isExpanding
}: PortalProps) => {
  const animatedMapStyle = useAnimatedStyle(() => {
    const { x, y, width, height } = layout
    // NB: This needs to capture progress.value for the expanding animation to work.
    // eslint-disable-next-line no-unused-vars
    const _ = progress.value
    return {
      position: "absolute",
      top: withTiFDefaultSpring(isExpanding.value ? 0 : y),
      left: withTiFDefaultSpring(isExpanding.value ? 0 : x),
      width: withTiFDefaultSpring(isExpanding.value ? SCREEN_WIDTH : width),
      height: withTiFDefaultSpring(isExpanding.value ? SCREEN_HEIGHT : height)
    }
  }, [layout])
  const { top } = useSafeAreaInsets()
  return (
    <Portal>
      {isVisible && (
        <Animated.View style={animatedMapStyle}>
          <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
            <Marker coordinate={region} />
          </MapView>
          <TouchableIonicon
            icon={{ name: "contract" }}
            onPress={onCollapsed}
            activeOpacity={0.8}
            style={[styles.closeButton, { top }]}
          />
        </Animated.View>
      )}
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  snippetContainer: {
    height: 150,
    borderRadius: 8,
    overflow: "hidden"
  },
  closeButton: {
    position: "absolute",
    right: 24,
    top: 24,
    width: 40,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  expandButton: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 40,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  }
})
