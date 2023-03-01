import React from "react"
import { HexColor } from "@lib/Color"
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useDependencyValue } from "../../lib/dependencies"
import { HapticEvent, hapticsDependencyKey } from "../../lib/Haptics"

export type HexColorPickerOption = {
  color: HexColor
  accessibilityLabel: string
}

/**
 * Props for a `HexColorPicker`.
 */
export type HexColorPickerProps = {
  /**
   * The current color that is selected in the picker.
   */
  color: HexColor

  /**
   * Acts upon the color changing in the picker.
   */
  onChange: (color: HexColor) => void

  /**
   * The available options in the picker.
   */
  options: HexColorPickerOption[]

  /**
   * The container style of the picker.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * A color picker which uses hex colors.
 */
const HexColorPicker = ({
  color,
  onChange,
  options,
  style
}: HexColorPickerProps) => {
  const playHaptics = useDependencyValue(hapticsDependencyKey)

  const colorTapped = (option: HexColor) => {
    if (Platform.OS === "ios") playHaptics(HapticEvent.SelectionChanged)
    onChange(option)
  }

  return (
    <View style={[styles.wrappedContainer, style]}>
      {options.map((option) => (
        <TouchableOpacity
          style={styles.optionContainer}
          key={option.color}
          onPress={() => colorTapped(option.color)}
          accessibilityLabel={option.accessibilityLabel}
        >
          <View
            style={{
              backgroundColor: option.color,
              borderRadius: 32,
              padding: 12
            }}
          >
            <MaterialIcons
              name="check"
              color="white"
              size={24}
              style={{ opacity: color === option.color ? 1 : 0 }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrappedContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap"
  },
  optionContainer: {
    marginHorizontal: 12,
    marginBottom: 12
  }
})

export default HexColorPicker
