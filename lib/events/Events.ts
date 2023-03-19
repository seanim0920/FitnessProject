import { createDependencyKey } from "@lib/dependencies"
import { TestEventItems } from "./Event"
import { FixedDateRange } from "@lib/Date"
import { LocationCoordinate2D, Placemark } from "@lib/location"
import { EventColors } from "./EventColors"

/**
 * A data type which is used to update event information.
 */
export type EditEventInput = {
  readonly title: string
  readonly description?: string
  readonly location: LocationCoordinate2D
  readonly color: EventColors
  readonly dateRange: FixedDateRange
  readonly shouldHideAfterStartDate: boolean
  readonly radiusMeters: number
}

/**
 * An interface representing all the collection of all of the posts in the app.
 */
export interface Events {
  /**
   * Fetches events with the given ids.
   *
   * @returns a list of events (right now just mocks a bunch of events)
   */
  eventsWithIds: (ids: string[]) => Event[]

  /**
   * Creates a new event.
   */
  createEvent: (input: EditEventInput) => Promise<Event>
}

/**
 * Right now doesn't use GraphQL
 *
 */
export class GraphQLEvents implements Events {
  eventsWithIds (ids: string[]): Event[] {
    if (ids.length === 0) return []
    const eventsList = []
    const date = new Date()
    const date2 = new Date()
    date.setHours(10, 30)
    date.setDate(date.getDate() + 0)
    date2.setHours(16, 30)
    date2.setDate(date2.getDate() + 2)

    for (let i = 0; i < ids.length; i++) {
      const event: Event = TestEventItems.mockEvent(
        date,
        date2,
        true,
        String(i)
      )
      eventsList.push(event)
    }

    return eventsList
  }

  async createEvent (input: EditEventInput): Promise<Event> {
    throw new Error("TODO")
  }
}

/**
 * A dependency key for an `Events` instance.
 */
export const eventsDependencyKey = createDependencyKey<Events>(
  new GraphQLEvents()
)
