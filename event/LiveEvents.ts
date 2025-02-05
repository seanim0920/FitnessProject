import {
  CallbackCollection,
  CallbackCollectionUnsubscribe
} from "@lib/utils/CallbackCollection"
import { QueryClient, QueryObserver } from "@tanstack/react-query"
import { TiFAPI } from "TiFShared/api"
import {
  ClientSideEvent,
  hasEventEnded,
  hasEventTimeStarted,
  clientSideEventFromResponse
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

/**
 * Events that the app is watching for their start times.
 */
export type LiveEvents = {
  /**
   * A list of ongoing events that the user is attending.
   */
  ongoing: ClientSideEvent[]

  /**
   * A list of events that are starting within the next 4 hours.
   */
  startingSoon: ClientSideEvent[]
}

const groupIntoLiveEvents = (events: ClientSideEvent[]) => {
  const ongoing = events.filter(
    (e) => hasEventTimeStarted(e.time) && !hasEventEnded(e)
  )
  const startingSoon = events.filter(
    (e) => !hasEventTimeStarted(e.time) && !hasEventEnded(e)
  )
  return { ongoing, startingSoon }
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

/**
 *  Fetches all live events for a specified user id.
 */
export const liveEvents = async (
  id: UserID,
  api: TiFAPI = TiFAPI.productionInstance
): Promise<LiveEvents> => {
  const resp = await api.upcomingEvents({
    query: { userId: id, maxSecondsToStart: LIVE_EVENT_SECONDS_TO_START }
  })
  if (resp.status !== 200) {
    throw new Error(
      `Failed to load live events for user with id ${id}, server responded with ${resp.status}.`
    )
  }
  return groupIntoLiveEvents(resp.data.events.map(clientSideEventFromResponse))
}

const liveEventsQueryKey = (id: UserID) => ["live-events", id]

export type LiveEventsUnsubscribe = CallbackCollectionUnsubscribe

const log = logger("live.events.store")

/**
 * A store for observing the {@link LiveEvents} for a user.
 */
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

  /**
   * Begins observing the {@link LiveEvents} for the specified user.
   */
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
      const newEvents = groupIntoLiveEvents([
        ...this.current.ongoing,
        ...this.current.startingSoon
      ])
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

/**
 * The {@link LiveEvents} for the current user.
 *
 * @param selector A selector to select which events to listen for.
 */
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
