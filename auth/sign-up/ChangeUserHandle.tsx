import { AuthFormView } from "@auth/AuthSection"
import { AuthShadedTextField } from "@auth/AuthTextFields"
import { Ionicon } from "@components/common/Icons"
import { useFormSubmission } from "@hooks/FormHooks"
import { sleep } from "@lib/DelayData"
import { QueryHookOptions } from "@lib/ReactQuery"
import { UserHandleError, UserHandle } from "@lib/users"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { ActivityIndicator, Alert, StyleProp, ViewStyle } from "react-native"

export type UseSignUpChangeUserHandleFormEnvironment = {
  checkIfUserHandleTaken: (
    handle: UserHandle,
    signal?: AbortSignal
  ) => Promise<boolean>
  changeUserHandle: (handle: UserHandle) => Promise<void>
  onSuccess: () => void
}

/**
 * Hook for handling the form where the user changes their handle during the sign-up process.
 *
 * @param initialHandle the intitial handle given (which should've been generated by the server)
 * @param debounceMillis the amount of debounce time between checking whena user handle already exists.
 * @param environment see {@link UseSignUpChangeUserHandleFormEnvironment}.
 */
export const useSignUpChangeUserHandleForm = (
  initialHandle: UserHandle,
  debounceMillis: number,
  {
    checkIfUserHandleTaken,
    changeUserHandle,
    onSuccess
  }: UseSignUpChangeUserHandleFormEnvironment
) => {
  const [handleText, setHandleText] = useState(initialHandle.rawValue)
  const { handle: parsedHandle, error: parseHandleError } =
    UserHandle.parse(handleText)

  const handleTakenCheck = useCheckIfHandleTakenQuery(
    parsedHandle!,
    async (handle: UserHandle, signal?: AbortSignal) => {
      await sleep(debounceMillis, signal)
      return await checkIfUserHandleTaken(handle, signal)
    },
    {
      enabled:
        !!parsedHandle && parsedHandle.rawValue !== initialHandle.rawValue,
      cacheTime: Infinity,
      staleTime: Infinity
    }
  )

  return {
    handleText,
    onHandleTextChanged: (handleText: string) => {
      handleTakenCheck.cancel()
      setHandleText(handleText)
    },
    isPerformingUserHandleTakenCheck: handleTakenCheck.query.isFetching,
    submission: useFormSubmission(
      changeUserHandle,
      () => {
        if (!parsedHandle) {
          return { status: "invalid", reason: parseHandleError } as const
        } else if (handleTakenCheck.query.data) {
          return { status: "invalid", reason: "already-taken" } as const
        } else {
          return {
            status: "submittable",
            submissionValues: parsedHandle
          }
        }
      },
      {
        onSuccess,
        onError: () => {
          Alert.alert("Oh No!", "Something went wrong, please try again.")
        }
      }
    )
  }
}

const useCheckIfHandleTakenQuery = (
  handle: UserHandle,
  check: (handle: UserHandle, signal?: AbortSignal) => Promise<boolean>,
  options: QueryHookOptions<boolean>
) => {
  const queryClient = useQueryClient()
  const queryKey = ["check-if-user-handle-taken", handle]
  return {
    query: useQuery(
      queryKey,
      async ({ signal }) => await check(handle, signal),
      options
    ),
    cancel: () => {
      queryClient.cancelQueries(queryKey)
    }
  }
}

export type SignUpChangeUserHandleFormProps = {
  style?: StyleProp<ViewStyle>
} & ReturnType<typeof useSignUpChangeUserHandleForm>

/**
 * A view which allows the user optionally edit their user handle during sign up.
 *
 * This gives them the chance to differ their handle from the one we generated.
 */
export const SignUpChangeUserHandleFormView = ({
  handleText,
  onHandleTextChanged,
  isPerformingUserHandleTakenCheck,
  submission,
  style
}: SignUpChangeUserHandleFormProps) => (
  <AuthFormView
    title="Choose your Username"
    description="We have created a username for you, but you can customize it if you don't like it. It's also possible to change it later if you want to."
    submissionTitle="I like this name!"
    iOSInModal
    submission={submission}
    style={style}
  >
    <AuthShadedTextField
      testID={handleText}
      iconName="at-outline"
      iconBackgroundColor="#A882DD"
      rightAddon={
        <>
          {isPerformingUserHandleTakenCheck
            ? (
              <ActivityIndicator />
            )
            : (
              <Ionicon
                color={submission.status !== "invalid" ? "#14B329" : "#FB3640"}
                name={submission.status !== "invalid" ? "checkmark" : "close"}
              />
            )}
        </>
      }
      error={
        submission.status === "invalid"
          ? errorTextForInvalidHandleReason(submission.reason)
          : undefined
      }
      placeholder="Enter a username"
      keyboardType="twitter"
      value={handleText}
      onChangeText={onHandleTextChanged}
    />
  </AuthFormView>
)

const errorTextForInvalidHandleReason = (
  invalidHandleReason: UserHandleError
) => {
  if (invalidHandleReason === "already-taken") {
    return "This username is already taken."
  } else if (invalidHandleReason === "empty") {
    return "Your username cannot be empty."
  } else if (invalidHandleReason === "too-long") {
    return "Your username cannot be longer than 15 characters"
  } else {
    return "Your username can only contain letters, numbers, and underscores."
  }
}
