import React, { ReactNode } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useToolbar } from "./Provider"
import { MaterialIcons } from "@expo/vector-icons"
import { useFontScale } from "@hooks/useFontScale"

export type EventFormToolbarSectionProps = {
  title: string
  children: ReactNode
}

export const EventFormToolbarSection = ({
  title,
  children
}: EventFormToolbarSectionProps) => {
  const { dismissCurrentSection } = useToolbar()
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity
          accessibilityLabel="Close Section"
          onPress={dismissCurrentSection}
        >
          <MaterialIcons
            style={styles.closeIcon}
            name="close"
            size={24 * useFontScale()}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold"
  },
  closeIcon: {
    opacity: 0.5
  }
})
