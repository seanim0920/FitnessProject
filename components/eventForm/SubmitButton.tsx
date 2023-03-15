import { FontScaleFactors } from "../../lib/FontScale"
import React from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useEventFormContext } from "./EventForm"
import { EventFormValuesSchema } from "./EventFormValues"

/**
 * Props from `EventFormSubmitButton`.
 */
export type EventFormSubmitButtonProps = {
  label: string
}

/**
 * Submit button for `EventForm`.
 */
export const EventFormSubmitButton = ({
  label
}: EventFormSubmitButtonProps) => {
  const submitButtonTapped = useSubmit()
  const color = useEventFormContext().watch("color")
  const canSubmit = !!submitButtonTapped
  return (
    <View style={{ opacity: canSubmit ? 1 : 0.5 }}>
      <TouchableOpacity
        onPress={() => submitButtonTapped?.()}
        disabled={!canSubmit}
        style={{
          ...styles.container,
          backgroundColor: color,
          shadowColor: color
        }}
      >
        <Text
          maxFontSizeMultiplier={FontScaleFactors.xxxLarge}
          disabled={!canSubmit}
          style={styles.button}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const useSubmit = () => {
  const { formState, submit, reset } = useEventFormContext()
  const { isDirty, isSubmitting } = formState
  const isValid = useIsValidForm()
  const canSubmit = isValid && !isSubmitting && isDirty
  if (!canSubmit) return undefined
  return async () => {
    try {
      await submit()
    } catch {
      reset(undefined, { keepValues: true, keepDirty: true })
      // TODO: - Should we just forward the actual error message from the thrown error here?
      Alert.alert(
        "Something went wrong...",
        "Please check your internet connection and try again later.",
        [{ text: "Ok" }]
      )
    }
  }
}

// TODO: - Remove this hack
const useIsValidForm = () => {
  const { watch } = useEventFormContext()
  try {
    EventFormValuesSchema.parse(watch())
    return true
  } catch {
    return false
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }
  },
  button: {
    padding: 8,
    color: "white",
    fontWeight: "bold"
  }
})
