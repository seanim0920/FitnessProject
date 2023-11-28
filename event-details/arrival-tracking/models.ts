import { faker } from "@faker-js/faker"
import {
  LocationCoordinate2D,
  LocationCoordinates2DSchema,
  mockLocationCoordinate2D
} from "@lib/location"
import { z } from "zod"

/**
 * A zod schema for {@link EventArrival}.
 */
export const EventArrivalSchema = z.object({
  eventId: z.number(),
  coordinate: LocationCoordinates2DSchema
})

/**
 * A zod schema for an array of {@link EventArrival}.
 */
export const EventArrivalsSchema = z.array(EventArrivalSchema)

/**
 * Event arrivals are sent as notifications when the user enters the area of an event,
 * so that other participants are aware of their arrival.
 *
 * The scheduling/sending of the push notifications is handled server-side.
 */
export type EventArrival = z.infer<typeof EventArrivalSchema>

export const mockEventArrival = (): EventArrival => ({
  eventId: parseInt(faker.random.numeric(3)),
  coordinate: mockLocationCoordinate2D()
})

export type EventArrivalOperationKind = "arrived" | "departed"

/**
 * The result of trying to post an arrival or departure from an event.
 */
export type EventArrivalOperationResult = {
  eventId: number
} & (
  | { status: "success" }
  | { status: "outdated-coordinate"; updatedCoordinate: LocationCoordinate2D }
  | { status: "non-upcoming" }
)
