import {
  EMPTY_LIVE_EVENTS,
  LiveEventsFeature,
  LiveEventsStore
} from "@event/LiveEvents"
import { createTestQueryClient } from "@test-helpers/ReactQuery"
import { act, renderHook, waitFor } from "@testing-library/react-native"
import { useHomeLiveEvents } from "./HomeLiveEvents"
import { verifyNeverOccurs } from "@test-helpers/ExpectNeverOccurs"
import { EventMocks } from "@event-details-boundary/MockData"
import { clientSideEventFromResponse } from "@event/ClientSideEvent"
import { AlphaUserMocks } from "@user/alpha/MockData"

describe("HomeLiveEvents tests", () => {
  describe("UseHomeLiveEvents tests", () => {
    const liveEvents = jest.fn()
    beforeEach(() => liveEvents.mockReset())

    it("should present no modal data when empty events", async () => {
      liveEvents.mockResolvedValueOnce(EMPTY_LIVE_EVENTS)
      const { result } = renderUseHomeLiveEvents()
      await verifyNeverOccurs(() => {
        expect(result.current.modalEvents).not.toEqual(undefined)
      })
    })

    it("should present the modal with both ongoing and events starting within the next 2 hours", async () => {
      const ongoingEvent = clientSideEventFromResponse({
        ...EventMocks.MockSingleAttendeeResponse,
        time: {
          ...EventMocks.MockSingleAttendeeResponse.time,
          secondsToStart: -190
        },
        id: 10
      })
      const startingSoonEvent = clientSideEventFromResponse({
        ...EventMocks.MockSingleAttendeeResponse,
        time: {
          ...EventMocks.MockSingleAttendeeResponse.time,
          secondsToStart: 1800
        },
        id: 9
      })
      const startingInMoreThan2Hours = clientSideEventFromResponse({
        ...EventMocks.MockSingleAttendeeResponse,
        time: {
          ...EventMocks.MockSingleAttendeeResponse.time,
          secondsToStart: 40_000
        },
        id: 11
      })
      liveEvents.mockResolvedValueOnce({
        ongoing: [ongoingEvent],
        startingSoon: [startingSoonEvent, startingInMoreThan2Hours]
      })
      const { result } = renderUseHomeLiveEvents()
      await waitFor(() => {
        expect(result.current.modalEvents).toEqual({
          ongoing: [ongoingEvent],
          startingSoon: [startingSoonEvent]
        })
      })
    })

    it("should remove the modal state when dismissing the modal", async () => {
      const ongoingEvent = clientSideEventFromResponse({
        ...EventMocks.MockSingleAttendeeResponse,
        time: {
          ...EventMocks.MockSingleAttendeeResponse.time,
          secondsToStart: -190
        },
        id: 10
      })
      liveEvents.mockResolvedValueOnce({
        ongoing: [ongoingEvent],
        startingSoon: []
      })
      const { result } = renderUseHomeLiveEvents()
      await waitFor(() => {
        expect(result.current.modalEvents).toEqual({
          ongoing: [ongoingEvent],
          startingSoon: []
        })
      })
      act(() => result.current.modalClosed())
      expect(result.current.modalEvents).toEqual(undefined)
    })

    const renderUseHomeLiveEvents = () => {
      const store = new LiveEventsStore(createTestQueryClient(), liveEvents)
      return renderHook(() => useHomeLiveEvents(AlphaUserMocks.Blob.id), {
        wrapper: ({ children }) => (
          <LiveEventsFeature.Provider store={store}>
            {children}
          </LiveEventsFeature.Provider>
        )
      })
    }
  })
})
