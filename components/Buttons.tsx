import { Headline } from "@components/Text"
import { AppStyles } from "@lib/AppColorStyle"
import { FormSubmission } from "@lib/utils/Form"
import React, { ReactNode } from "react"
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from "react-native"

type ContentStyle<Children extends ReactNode> = Children extends string | number
  ? { contentStyle?: StyleProp<TextStyle> }
  : { contentStyle?: StyleProp<ViewStyle> }

export type FormSubmissionButtonProps<
  SubmissionArgs,
  SubmissionResult,
  InvalidValidationResult extends { status: "invalid" },
  Children extends ReactNode
> = Omit<TouchableOpacityProps, "onPress" | "disabled"> & {
  submission: FormSubmission<
    SubmissionArgs,
    SubmissionResult,
    InvalidValidationResult
  >
} & ContentStyle<Children> & {
    maximumFontSizeMultiplier?: number
  }

/**
 * The button that should be used for main CTAs and should have visual hierarchy
 * precedence over other ui elements.
 *
 * By default, the button uses a dark background with white text, though this can
 * be overriden by using the `style` prop. The button is also 48px tall, and
 * uses 16px horizontal paddings, to get a full screen button override `width` to
 * 100% in the `style` prop.
 */
export const FormSubmissionPrimaryButton = <
  SubmissionArgs,
  SubmissionResult,
  InvalidValidationResult extends { status: "invalid" },
  Children extends ReactNode
>({
  style,
  contentStyle,
  submission,
  ...props
}: FormSubmissionButtonProps<
  SubmissionArgs,
  SubmissionResult,
  InvalidValidationResult,
  Children
>) => (
  <BaseButton
    style={[
      styles.defaultPrimaryBackground,
      styles.container,
      style,
      { opacity: submission.status !== "submittable" ? 0.5 : 1 }
    ]}
    disabled={submission.status !== "submittable"}
    activeOpacity={0.8}
    contentStyle={[styles.primaryContent, contentStyle]}
    onPress={() => {
      if (submission.status === "submittable") {
        submission.submit()
      }
    }}
    {...props}
  />
)

/**
 * Props for a button.
 */
export type ButtonProps<Children extends ReactNode> = (TouchableOpacityProps &
  ContentStyle<Children>) & {
  maximumFontSizeMultiplier?: number
}

/**
 * The button that should be used for main CTAs and should have visual hierarchy
 * precedence over other ui elements.
 *
 * By default, the button uses a dark background with white text, though this can
 * be overriden by using the `style` prop. The button is also 48px tall, and
 * uses 16px horizontal paddings, to get a full screen button override `width` to
 * 100% in the `style` prop.
 */
export const PrimaryButton = <Children extends ReactNode>({
  style,
  contentStyle,
  disabled,
  ...props
}: ButtonProps<Children>) => (
  <BaseButton
    style={[
      styles.defaultPrimaryBackground,
      styles.container,
      style,
      { opacity: disabled ? 0.5 : 1 }
    ]}
    disabled={disabled}
    activeOpacity={0.8}
    contentStyle={[styles.primaryContent, contentStyle]}
    {...props}
  />
)

/**
 * An outlined button which should be used as a secondary element to other visual elements in the hierarchy.
 *
 * This can be used as a CTA, but not for actions we "for the profitable running of the business" would want
 * the user to tap such as leaving an event.
 *
 * The button is 48px tall, and uses 16px horizontal paddings, to get a full screen button override `width` to
 * 100% in the `style` prop.
 */
export const SecondaryOutlinedButton = <Children extends ReactNode>({
  style,
  disabled,
  ...props
}: ButtonProps<Children>) => (
  <BaseButton
    style={[
      styles.container,
      styles.outlinedButton,
      style,
      { opacity: disabled ? 0.4 : 1 }
    ]}
    disabled={disabled}
    activeOpacity={0.65}
    {...props}
  />
)

const BaseButton = <Children extends ReactNode>({
  style,
  maximumFontSizeMultiplier,
  ...props
}: ButtonProps<Children>) => (
  <TouchableOpacity {...props} style={style}>
    {typeof props.children === "string" ||
    typeof props.children === "number" ? (
      <Headline
        maxFontSizeMultiplier={maximumFontSizeMultiplier}
        style={props.contentStyle}
      >
        {props.children}
      </Headline>
    ) : (
      <View style={props.contentStyle}>{props.children}</View>
    )}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 16
  },
  primaryContent: {
    color: "white"
  },
  defaultPrimaryBackground: {
    backgroundColor: AppStyles.primaryColor
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: AppStyles.colorOpacity15
  }
})
