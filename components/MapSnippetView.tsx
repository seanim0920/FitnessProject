import React, { useRef, useState, useCallback } from "react"
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  findNodeHandle,
  UIManager,
  StyleProp,
  ViewStyle,
  LayoutRectangle
} from "react-native"
import MapView, { Marker, Region } from "react-native-maps"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  interpolate,
  Extrapolation,
  SharedValue
} from "react-native-reanimated"
import { LocationCoordinate2D } from "TiFShared/domain-models/LocationCoordinate2D"
import { Portal } from "@gorhom/portal"
import { withTiFDefaultSpring } from "@lib/Reanimated"

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
export const MapSnippetView = ({ region }: MapSnippetProps) => {
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
    <View style={styles.container}>
      <View ref={snippetRef} style={styles.snippetContainer}>
        <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
          <Marker coordinate={region} />
        </MapView>
        <Pressable onPress={expand} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>Expand</Text>
        </Pressable>
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
      height: withTiFDefaultSpring(isExpanding.value ? SCREEN_HEIGHT : height),
      zIndex: 9999
    }
  }, [layout])
  return (
    <Portal>
      {isVisible && (
        <Animated.View style={[animatedMapStyle]}>
          <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
            <Marker coordinate={region} />
          </MapView>
          <Pressable onPress={onCollapsed} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
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
    margin: 16,
    borderRadius: 8,
    overflow: "hidden"
  },
  expandButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  expandButtonText: {
    color: "#fff",
    fontWeight: "600"
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "bold"
  }
})
