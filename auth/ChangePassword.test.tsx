import { Password } from "@auth/Password"
import { useChangePasswordForm } from "@auth/ChangePasswordForm"
import { act, renderHook, waitFor } from "@testing-library/react-native"
import { captureAlerts } from "../tests/helpers/Alerts"
import {
  TestQueryClientProvider,
  createTestQueryClient
} from "../tests/helpers/ReactQuery"
import { neverPromise } from "../tests/helpers/Promise"

describe("ChangePassword tests", () => {
  beforeEach(() => jest.resetAllMocks())

  describe("UseChangePassword tests", () => {
    const queryClient = createTestQueryClient()
    beforeEach(() => queryClient.clear())

    afterAll(() => {
      queryClient.resetQueries()
      queryClient.clear()
    })

    const changePassword = jest.fn()
    const onSuccess = jest.fn()

    const { tapAlertButton, alertPresentationSpy } = captureAlerts()

    const retry = async () => {
      await tapAlertButton("Try Again")
    }

    const dismissIncorrectCurrentPasswordAlert = async () => {
      await tapAlertButton("Ok")
    }

    const renderChangePassword = () => {
      return renderHook(
        () =>
          useChangePasswordForm({
            changePassword,
            onSuccess
          }),
        {
          wrapper: ({ children }) => (
            <TestQueryClientProvider client={queryClient}>
              {children}
            </TestQueryClientProvider>
          )
        }
      )
    }

    it("should give an invalid state, if the current password matches the new password", () => {
      const currentPassword = "FiddleSticks32@"

      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", currentPassword))
      act(() => result.current.updateField("newPassword", currentPassword))

      expect(result.current.submission).toMatchObject({
        status: "invalid",
        newPasswordError: "current-matches-new",
        currentPasswordError: undefined
      })
    })

    it("should give an invalid state, if the new password is not strong enough: too short", () => {
      const newPassword = "Wat2%"
      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", "ReturnToAll32@"))
      act(() => result.current.updateField("newPassword", newPassword))

      expect(result.current.submission).toMatchObject({
        status: "invalid",
        newPasswordError: "weak-new-password",
        currentPasswordError: undefined
      })
    })

    it("should have a submitting status while in process in submitting", async () => {
      changePassword.mockImplementation(neverPromise)
      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", "ReturnToAll32@"))
      act(() => result.current.updateField("newPassword", "OblivionAwaits43#"))

      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(result.current.submission.status).toEqual("submitting")
      })
    })

    it("should have a successful submission flow", async () => {
      changePassword.mockImplementation(
        (uncheckedOldPass: string, newPass: Password) => {
          if (
            uncheckedOldPass === "ReturnToAll32@" &&
            newPass.rawValue === "OblivionAwaits43#"
          ) {
            return Promise.resolve("valid")
          }
          return Promise.resolve("invalid")
        }
      )

      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", "ReturnToAll32@"))
      act(() => result.current.updateField("newPassword", "OblivionAwaits43#"))

      act(() => (result.current.submission as any).submit())

      await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })

    test("incorrect current password and weak new password at the same time", async () => {
      changePassword.mockResolvedValueOnce("incorrect-password")
      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", "ReturnToAll32@"))
      act(() => result.current.updateField("newPassword", "OblivionAwaits43#"))

      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(result.current.submission).toMatchObject({
          status: "invalid",
          currentPasswordError: "incorrect-current-password",
          newPasswordError: undefined
        })
      })

      act(() => result.current.updateField("newPassword", "1234"))

      expect(result.current.submission).toMatchObject({
        status: "invalid",
        currentPasswordError: "incorrect-current-password",
        newPasswordError: "weak-new-password"
      })
    })

    test("submit incorrect current password, then resubmit with correct one", async () => {
      changePassword
        .mockResolvedValueOnce("incorrect-password")
        .mockResolvedValueOnce("valid")

      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", "ReturnToAll32@"))
      act(() => result.current.updateField("newPassword", "OblivionAwaits43#"))

      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(result.current.submission).toMatchObject({
          status: "invalid",
          currentPasswordError: "incorrect-current-password",
          newPasswordError: undefined
        })
      })
      expect(alertPresentationSpy).toHaveBeenCalled()

      await dismissIncorrectCurrentPasswordAlert()

      act(() => result.current.updateField("currentPassword", "1234"))
      act(() => (result.current.submission as any).submit())

      await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })

    it("remembers every incorrect current password when typed in the current password field", async () => {
      changePassword.mockResolvedValue("incorrect-password")

      const { result } = renderChangePassword()

      const firstPassword = "ReturnToAll32@"
      const secondPassword = "1234"

      act(() => result.current.updateField("currentPassword", firstPassword))
      act(() => result.current.updateField("newPassword", "OblivionAwaits43#"))

      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(result.current.submission.status).toEqual("invalid")
      })

      act(() => result.current.updateField("currentPassword", secondPassword))
      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(result.current.submission.status).toEqual("invalid")
      })

      act(() => result.current.updateField("currentPassword", firstPassword))
      expect(result.current.submission.status).toEqual("invalid")

      act(() => result.current.updateField("currentPassword", secondPassword))
      expect(result.current.submission.status).toEqual("invalid")
    })

    it("should be able to retry when it gets an error", async () => {
      changePassword
        .mockRejectedValueOnce(new Error())
        .mockResolvedValueOnce("valid")

      const { result } = renderChangePassword()

      act(() => result.current.updateField("currentPassword", "ReturnToAll32@"))
      act(() => result.current.updateField("newPassword", "OblivionAwaits43#"))

      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(alertPresentationSpy).toHaveBeenCalled()
      })

      retry()

      await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })

    it("should produce empty error messages when a field is empty", () => {
      const { result } = renderChangePassword()

      expect(result.current.submission).toMatchObject({
        status: "invalid",
        currentPasswordError: "empty",
        newPasswordError: "empty"
      })

      act(() => result.current.updateField("currentPassword", "abc123"))

      expect(result.current.submission).toMatchObject({
        status: "invalid",
        currentPasswordError: undefined,
        newPasswordError: "empty"
      })
    })
  })
})
