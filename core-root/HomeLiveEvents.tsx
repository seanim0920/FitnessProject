import { eventSecondsToStart } from "@event/ClientSideEvent"
import {
  EMPTY_LIVE_EVENTS,
  LiveEventsFeature,
  LiveEventsStore,
  useLiveEvents
} from "@event/LiveEvents"
import { UserID } from "TiFShared/domain-models/User"
import { shallowEquals } from "TiFShared/lib/ShallowEquals"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

const TWO_HOURS = dayjs.duration(2, "hours").asSeconds()

export const useHomeLiveEvents = (id: UserID) => {
  const { store } = LiveEventsFeature.useContext()
  const [isModalClosed, setIsModalClosed] = useState(false)
  useEffect(() => {
    return store.beginObserving(id)
  }, [store, id])
  const liveEvents = useLiveEvents((events) => {
    if (isModalClosed || shallowEquals(events, EMPTY_LIVE_EVENTS)) {
      return undefined
    }
    return {
      ...events,
      startingSoon: events.startingSoon.filter(
        (e) => eventSecondsToStart(e.time) <= TWO_HOURS
      )
    }
  })
  return {
    modalEvents: isModalClosed ? undefined : liveEvents,
    modalClosed: () => setIsModalClosed(true)
  }
}
