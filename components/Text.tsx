import React from "react"
import { StyleSheet, Text, TextProps } from "react-native"

/**
 * A text component that represents the standard title of
 * some UI element.
 */
export const Title = (props: TextProps) => (
  <Text {...props} style={[styles.title, props.style]} />
)

/**
 * A text component for standard text that the user sees.
 */
export const BodyText = (props: TextProps) => (
  <Text {...props} style={[styles.body, props.style]} />
)

/**
 * A text component for smaller and more subtle details.
 */
export const Caption = (props: TextProps) => (
  <Text {...props} style={[styles.caption, props.style]} />
)

/**
 * A text component with the same font size as {@link BodyText}
 * that allows for more emphasis on a particular UI element
 * group.
 */
export const Headline = (props: TextProps) => (
  <Text {...props} style={[styles.headline, props.style]} />
)

const styles = StyleSheet.create({
  title: {
    fontFamily: "OpenSansBold",
    fontSize: 24
  },
  body: {
    fontFamily: "OpenSans",
    fontSize: 16
  },
  caption: {
    fontFamily: "OpenSans",
    fontSize: 12,
    opacity: 0.35
  },
  headline: {
    fontFamily: "OpenSansBold",
    fontSize: 16
  }
})
