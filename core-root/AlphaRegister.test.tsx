import { act, renderHook, waitFor } from "@testing-library/react-native"
import {
  TestQueryClientProvider,
  createTestQueryClient
} from "@test-helpers/ReactQuery"
import { captureAlerts } from "@test-helpers/Alerts"
import { ALERTS, AlphaRegisterFeature, useAlphaRegister } from "./AlphaRegister"
import { AlphaUserMocks } from "@user/alpha/MockData"
import { UserSessionProvider, useUserSessionQuery } from "@user/Session"

describe("AlphaRegister tests", () => {
  describe("UseAlphaRegister tests", () => {
    const registerUser = jest.fn()
    const queryClient = createTestQueryClient()

    beforeEach(() => {
      queryClient.resetQueries()
      jest.resetAllMocks()
    })

    it("should not allow registration with an empty name", () => {
      const { result } = renderUseAlphaRegister()
      expect(result.current.submission.status).toEqual("invalid")
    })

    it("should update the user session when successfully submitted", async () => {
      const { result } = renderUseAlphaRegister()
      const { result: userSession } = renderUseUserSessionQuery()
      act(() => result.current.nameChanged(AlphaUserMocks.TheDarkLord.name))
      registerUser.mockResolvedValueOnce(AlphaUserMocks.TheDarkLord)
      expect(userSession.current.data?.name).toEqual(undefined)
      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(userSession.current.data?.name).toEqual(
          AlphaUserMocks.TheDarkLord.name
        )
      })
    })

    test("submission failure", async () => {
      const { result } = renderUseAlphaRegister()
      act(() => result.current.nameChanged(AlphaUserMocks.TheDarkLord.name))
      registerUser.mockRejectedValueOnce(new Error())
      act(() => (result.current.submission as any).submit())

      await waitFor(() => {
        expect(alertPresentationSpy).toHaveBeenPresentedWith(
          ALERTS.failedToRegister
        )
      })
      expect((result.current.submission as any).data).toEqual(undefined)
    })

    const { alertPresentationSpy } = captureAlerts()

    const renderUseUserSessionQuery = () => {
      return renderHook(useUserSessionQuery, {
        wrapper: ({ children }) => (
          <TestQueryClientProvider client={queryClient}>
            <UserSessionProvider
              userSession={async () => {
                throw new Error("No Session")
              }}
            >
              {children}
            </UserSessionProvider>
          </TestQueryClientProvider>
        )
      })
    }

    const renderUseAlphaRegister = () => {
      return renderHook(useAlphaRegister, {
        wrapper: ({ children }) => (
          <TestQueryClientProvider client={queryClient}>
            <AlphaRegisterFeature.Provider register={registerUser}>
              {children}
            </AlphaRegisterFeature.Provider>
          </TestQueryClientProvider>
        )
      })
    }
  })
})
