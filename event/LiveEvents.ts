import {
  CallbackCollection,
  CallbackCollectionUnsubscribe
} from "@lib/utils/CallbackCollection"
import { QueryClient, QueryObserver } from "@tanstack/react-query"
import { TiFAPI } from "TiFShared/api"
import {
  ClientSideEvent,
  hasEventEnded,
  hasEventStarted
} from "./ClientSideEvent"
import { UserID } from "TiFShared/domain-models/User"
import { tiFQueryClient } from "@lib/ReactQuery"
import { featureContext } from "@lib/FeatureContext"
import { useCallback } from "react"
import { dayjs } from "TiFShared/lib/Dayjs"
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector"
import { shallowEquals } from "TiFShared/lib/ShallowEquals"
import {
  clearAutocorrectingInterval,
  setAutocorrectingInterval
} from "@lib/AutocorrectingInterval"
import { logger } from "TiFShared/logging"

export type LiveEvents = {
  ongoing: ClientSideEvent[]
  startingSoon: ClientSideEvent[]
}

const shiftEvents = (events: LiveEvents) => {
  const newlyOngoingEvents = events.startingSoon.filter((e) => {
    return hasEventStarted(e.time)
  })
  const stillOngoingEvents = events.ongoing.filter(
    (e) => !hasEventEnded(e.time)
  )
  const startingSoonEvents = events.startingSoon.filter((e) => {
    return !hasEventStarted(e.time)
  })
  return {
    ongoing: [...stillOngoingEvents, ...newlyOngoingEvents],
    startingSoon: startingSoonEvents
  }
}

const isStructurallySameEvents = (e1: LiveEvents, e2: LiveEvents) => {
  const isSameOngoing = shallowEquals(
    e1.ongoing.map((e) => e.id),
    e2.ongoing.map((e) => e.id)
  )
  const isSameStartingSoon = shallowEquals(
    e1.startingSoon.map((e) => e.id),
    e2.startingSoon.map((e) => e.id)
  )
  return isSameOngoing && isSameStartingSoon
}

export const LIVE_EVENT_SECONDS_TO_START = dayjs
  .duration(4, "hours")
  .asSeconds()

export const liveEvents = async (
  id: UserID,
  api: TiFAPI = TiFAPI.productionInstance
): Promise<LiveEvents> => {
  return { ongoing: [], startingSoon: [] }
}

const liveEventsQueryKey = (id: UserID) => ["live-events", id]

export type LiveEventsUnsubscribe = CallbackCollectionUnsubscribe

const log = logger("live.events.store")

export class LiveEventsStore {
  private readonly subscribers = new CallbackCollection()
  private readonly queryClient: QueryClient
  private readonly liveEvents: (id: UserID) => Promise<LiveEvents>
  private readonly rotationMillis: number
  private _current: LiveEvents

  get current(): LiveEvents {
    return this._current
  }

  constructor(
    queryClient: QueryClient = tiFQueryClient,
    events: (id: UserID) => Promise<LiveEvents> = liveEvents,
    rotationMillis: number = 5000
  ) {
    this.queryClient = queryClient
    this.liveEvents = events
    this.rotationMillis = rotationMillis
    this._current = { ongoing: [], startingSoon: [] }
  }

  subscribe(fn: (events: LiveEvents) => void): LiveEventsUnsubscribe {
    const unsub = this.subscribers.add(fn)
    fn(this._current)
    return unsub
  }

  beginObserving(id: UserID): LiveEventsUnsubscribe {
    const observer = new QueryObserver(this.queryClient, {
      queryKey: liveEventsQueryKey(id),
      queryFn: async () => await this.liveEvents(id)
    })
    const unsub = observer.subscribe((result) => {
      if (result.isError) {
        log.error("Failed to fetch live events.", {
          error: result.error,
          userId: id
        })
      }
      if (!result.data) return
      this.updateCurrent(result.data)
      log.info("Successfully fetched live events.", { userId: id })
    })
    const interval = setAutocorrectingInterval(() => {
      const newEvents = shiftEvents(this.current)
      if (!isStructurallySameEvents(this.current, newEvents)) {
        log.info("Shifted Live Events", { userId: id })
        this.updateCurrent(newEvents)
      }
    }, this.rotationMillis)
    return () => {
      unsub()
      clearAutocorrectingInterval(interval)
    }
  }

  private updateCurrent(events: LiveEvents) {
    this._current = events
    this.subscribers.send(events)
  }
}

export const LiveEventsFeature = featureContext({
  store: new LiveEventsStore()
})

export const useLiveEvents = <T>(selector: (liveEvents: LiveEvents) => T) => {
  const { store } = LiveEventsFeature.useContext()
  return useSyncExternalStoreWithSelector(
    useCallback((fn) => store.subscribe(fn), [store]),
    () => store.current,
    undefined,
    selector,
    shallowEquals
  )
}
