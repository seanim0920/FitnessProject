import { captureAlerts } from "@test-helpers/Alerts"
import { TestQueryClientProvider } from "@test-helpers/ReactQuery"
import { act, renderHook, waitFor } from "@testing-library/react-native"
import { AlphaUserMocks } from "@user/alpha/MockData"
import {
  HELP_AND_SUPPORT_ALERTS,
  HELP_AND_SUPPORT_EMAILS,
  HELP_AND_SUPPORT_EMAIL_ERROR_ALERTS,
  HELP_AND_SUPPORT_EMAIL_SUCCESS_ALERTS,
  HelpAndSupportFeature,
  useHelpAndSupportSettings
} from "./HelpAndSupport"

describe("HelpAndSupportSettings tests", () => {
  describe("UseHelpAndSupportSettings tests", () => {
    const TEST_COMPILE_LOGS_URI = "test/logs.zip"
    const { alertPresentationSpy, tapAlertButton } = captureAlerts()
    const isShowingContactSection = jest.fn()
    const compileLogs = jest.fn()
    const composeEmail = jest.fn()
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test("Detect if signed in to email", async () => {
      isShowingContactSection.mockResolvedValue(false)
      const { result } = renderUseHelpAndSupportSettings()
      expect(result.current.isShowingContactSection).toEqual(true)
      await waitFor(() =>
        expect(result.current.isShowingContactSection).toEqual(false)
      )
    })

    test("Successful submit feedback flow", async () => {
      const result = await renderSuccessfulEmailCompositionFlow()
      act(() => result.current.feedbackSubmitted())
      await waitFor(async () => {
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_SUCCESS_ALERTS.submitFeedback
        )
      })
      expect(composeEmail).toHaveBeenCalledWith(
        HELP_AND_SUPPORT_EMAILS.feedbackSubmitted(AlphaUserMocks.TheDarkLord.id)
      )
    })

    test("Unsuccessful submit feedback flow", async () => {
      const result = await renderUnsuccessfulEmailCompositionFlow()
      act(() => result.current.feedbackSubmitted())
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_ERROR_ALERTS.submitFeedback
        )
      )
    })

    test("Successful report bug flow: no logs selected", async () => {
      compileLogs.mockRejectedValueOnce(new Error("Logs not compiled"))
      const result = await renderSuccessfulEmailCompositionFlow()
      act(() => result.current.bugReported())
      await reportWithoutLogs()
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_SUCCESS_ALERTS.reportBug
        )
      )
      expect(composeEmail).toHaveBeenCalledWith(
        HELP_AND_SUPPORT_EMAILS.bugReported(
          undefined,
          AlphaUserMocks.TheDarkLord.id
        )
      )
    })

    test("Successful report bug flow: logs success", async () => {
      compileLogs.mockResolvedValueOnce(TEST_COMPILE_LOGS_URI)
      const result = await renderSuccessfulEmailCompositionFlow()
      act(() => result.current.bugReported())
      await reportWithLogs()
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_SUCCESS_ALERTS.reportBug
        )
      )
      expect(composeEmail).toHaveBeenCalledWith(
        HELP_AND_SUPPORT_EMAILS.bugReported(
          TEST_COMPILE_LOGS_URI,
          AlphaUserMocks.TheDarkLord.id
        )
      )
    })

    test("Successful report bug flow: logs failure, switch to no logs", async () => {
      compileLogs.mockRejectedValueOnce(new Error("Something went wrong"))
      const result = await renderSuccessfulEmailCompositionFlow()
      act(() => result.current.bugReported())
      await reportWithLogs()
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_ALERTS.compileLogError()
        )
      )
      await reportWithoutLogsAfterFailure()
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_SUCCESS_ALERTS.reportBug
        )
      )
      expect(composeEmail).toHaveBeenCalledWith(
        HELP_AND_SUPPORT_EMAILS.bugReported(
          undefined,
          AlphaUserMocks.TheDarkLord.id
        )
      )
    })

    test("Successful submit question flow", async () => {
      const result = await renderSuccessfulEmailCompositionFlow()
      await waitFor(() => act(() => result.current.questionSubmitted()))
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_SUCCESS_ALERTS.submitQuestion
        )
      )

      expect(composeEmail).toHaveBeenCalledWith(
        HELP_AND_SUPPORT_EMAILS.questionSubmitted(AlphaUserMocks.TheDarkLord.id)
      )
    })

    test("Unsuccessful submit question flow", async () => {
      composeEmail.mockRejectedValue(new Error("Bad error"))
      isShowingContactSection.mockResolvedValueOnce(true)
      const { result } = renderUseHelpAndSupportSettings()
      await waitFor(() =>
        expect(result.current.isShowingContactSection).toEqual(true)
      )
      act(() => result.current.questionSubmitted())
      await waitFor(() =>
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          HELP_AND_SUPPORT_EMAIL_ERROR_ALERTS.submitQuestion
        )
      )
    })

    const renderSuccessfulEmailCompositionFlow = async () => {
      composeEmail.mockResolvedValue("success")
      isShowingContactSection.mockResolvedValueOnce(true)
      const { result } = renderUseHelpAndSupportSettings()
      await waitFor(() =>
        expect(result.current.isShowingContactSection).toEqual(true)
      )
      return result
    }

    const renderUnsuccessfulEmailCompositionFlow = async () => {
      composeEmail.mockRejectedValue(new Error("Bad error"))
      isShowingContactSection.mockResolvedValueOnce(true)
      const { result } = renderUseHelpAndSupportSettings()
      await waitFor(() =>
        expect(result.current.isShowingContactSection).toEqual(true)
      )
      return result
    }

    const renderUseHelpAndSupportSettings = () => {
      return renderHook(
        () =>
          useHelpAndSupportSettings({
            userID: AlphaUserMocks.TheDarkLord.id
          }),
        {
          wrapper: ({ children }: any) => (
            <HelpAndSupportFeature.Provider
              isMailComposerAvailable={isShowingContactSection}
              compileLogs={compileLogs}
              composeEmail={composeEmail}
            >
              <TestQueryClientProvider>{children}</TestQueryClientProvider>
            </HelpAndSupportFeature.Provider>
          )
        }
      )
    }

    const reportWithoutLogs = async () => {
      await tapAlertButton("No")
    }

    const reportWithoutLogsAfterFailure = async () => {
      await tapAlertButton("OK")
    }

    const reportWithLogs = async () => {
      await tapAlertButton("Yes")
    }
  })
})
