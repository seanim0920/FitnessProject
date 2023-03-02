import React, { ComponentProps, ReactNode } from "react"
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native"
import { useEventFormContext } from ".."
import {
  _ToolbarProvider,
  _ToolbarSection,
  _useToolbar
} from "./ToolbarProvider"
import { MaterialIcons } from "@expo/vector-icons"

/**
 * A horizontally scrolling toolbar for an event form.
 *
 * Each tab on the toolbar opens a bottom sheet screen
 * where its respective form values can be edited.
 */
export const EventFormToolbar = () => {
  return (
    <_ToolbarProvider>
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
        <DateTab />
        <ColorTab />
        <AdvancedSettingsTab />
      </ScrollView>
    </_ToolbarProvider>
  )
}

const DateTab = () => (
  <SectionTab section="date" accessibilityLabel="Update Dates">
    <SectionTabIcon name="date-range" style={styles.tabSpacer} />
    <Text style={styles.tabText}>
      {useEventFormContext().watch("dateRange").formatted()}
    </Text>
  </SectionTab>
)

const ColorTab = () => (
  <SectionTab section="color" accessibilityLabel="Color">
    <SectionTabIcon name="palette" style={styles.tabSpacer} />
    <Text style={[styles.tabText, styles.tabSpacer]}>Color</Text>
    <ColorCicle />
  </SectionTab>
)

const ColorCicle = () => (
  <View
    style={{
      backgroundColor: useEventFormContext().watch("color"),
      ...styles.colorCircle
    }}
  />
)

const AdvancedSettingsTab = () => (
  <SectionTab section="advanced" accessibilityLabel="Advanced Settings">
    <SectionTabIcon name="keyboard-control" />
  </SectionTab>
)

type SectionTabIconProps = {
  name: ComponentProps<typeof MaterialIcons>["name"]
  style?: StyleProp<ViewStyle>
}

const SectionTabIcon = ({ name, style = {} }: SectionTabIconProps) => (
  <MaterialIcons
    name={name}
    size={16}
    color="black"
    style={[styles.tabIcon, style]}
  />
)

type SectionTabProps = {
  children: ReactNode
  section: _ToolbarSection
  accessibilityLabel: string
}

const SectionTab = ({
  children,
  section,
  accessibilityLabel
}: SectionTabProps) => {
  const { openSection } = _useToolbar()
  return (
    <TouchableOpacity
      onPress={() => openSection(section)}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.outlined}>
        <View style={styles.tabChild}>
          <View style={styles.tabContentContainer}>{children}</View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 16,
    height: 64
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#dedede",
    outlineColor: "black",
    outlineStyle: "solid",
    outlineWidth: 1,
    marginRight: 8
  },
  tabChild: {
    padding: 8
  },
  tabContentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  tabText: {
    fontWeight: "600",
    opacity: 0.5
  },
  tabIcon: {
    opacity: 0.5
  },
  tabSpacer: {
    marginRight: 8
  },
  colorCircle: {
    borderRadius: 32,
    height: 16,
    width: 16
  }
})
