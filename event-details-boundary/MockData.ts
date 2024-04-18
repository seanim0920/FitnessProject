
import { UserHandle } from "@content-parsing"
import { dateRange, dayjs } from "@date-time"
import { uuidString } from "@lib/utils/UUID"
import { ClientSideEvent } from "@event/ClientSideEvent"
import { mockLocationCoordinate2D, mockPlacemark } from "@location/MockData"
import { faker } from "@faker-js/faker"
import { ColorString } from "@lib/utils/Color"
import {
  randomBool,
  randomIntegerInRange,
  randomlyNull
} from "@lib/utils/Random"
import { uuidString } from "@lib/utils/UUID"
import { mockLocationCoordinate2D, mockPlacemark } from "@location/MockData"
import { EventChatTokenRequest } from "@shared-models/ChatToken"
import {
  CurrentUserEvent,
  EventAttendee,
  EventLocation
} from "@shared-models/Event"
import { ColorString } from "TiFShared/domain-models/ColorString"
import { dateRange } from "TiFShared/domain-models/FixedDateRange"
import { dayjs } from "TiFShared/lib/Dayjs"
import { UserHandle } from "TiFShared/domain-models/User"
import { EventLocation, EventAttendee } from "TiFShared/domain-models/Event"
import { ChatTokenRequest } from "TiFShared/api/models/Chat"

export const mockEventLocation = (): EventLocation => ({
  coordinate: mockLocationCoordinate2D(),
  arrivalRadiusMeters: parseInt(faker.random.numeric(3)),
  isInArrivalTrackingPeriod: randomBool(),
  timezoneIdentifier: faker.address.timeZone(),
  placemark: randomlyNull(mockPlacemark())
})

export const mockEventChatTokenRequest = (): ChatTokenRequest => ({
  capability: JSON.stringify({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5678-event": ["history", "publish", "subscribe"],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5878-event-pinned": ["history", "subscribe"]
  }),
  clientId: uuidString(),
  keyName: "abcdefghijklmnopqrstuvwxyz123456",
  mac: "abcdefghijklmnopqrstuvwxyz123456",
  timestamp: new Date().getTime(),
  nonce: "1234567890123456"
})

/**
 * Some mock {@link EventAttendee} objects.
 */
export namespace EventAttendeeMocks {
  export const Alivs = {
    id: uuidString(),
    username: "Alvis",
    handle: UserHandle.optionalParse("alvis")!,
    profileImageURL:
      "https://www.escapistmagazine.com/wp-content/uploads/2023/05/xc3-future-redeemed-alvis.jpg?resize=1200%2C673",
    relations: {
      themToYou: "not-friends",
      youToThem: "not-friends"
    }
  } as EventAttendee

  export const BlobJr = {
    id: uuidString(),
    username: "Blob Jr.",
    handle: UserHandle.optionalParse("SmallBlob")!,
    profileImageURL: null,
    relations: {
      themToYou: "not-friends",
      youToThem: "not-friends"
    }
  } as EventAttendee

  export const BlobSr = {
    id: uuidString(),
    username: "Blob Sr.",
    handle: UserHandle.optionalParse("OriginalBlob")!,
    profileImageURL: null,
    relations: {
      themToYou: "not-friends",
      youToThem: "not-friends"
    }
  } as EventAttendee

  // NB: Unfortunately, we can't reuse Harrison's legendary
  // Anna Admin and Molly Member personas, bc this isn't a book club...
  // (Also Molly died and was replaced with Haley Host...)

  export const AnnaAttendee = {
    id: uuidString(),
    username: "Anna Attendee",
    handle: UserHandle.optionalParse("AnnaAttendee")!,
    profileImageURL: null,
    relations: {
      themToYou: "not-friends",
      youToThem: "not-friends"
    }
  } as EventAttendee

  export const HaleyHost = {
    id: uuidString(),
    username: "Haley Host",
    handle: UserHandle.optionalParse("HaleyHost")!,
    profileImageURL: null,
    relations: {
      themToYou: "not-friends",
      youToThem: "not-friends"
    }
  } as EventAttendee
}

/**
 * Some mock {@link ClientSideEvent} objects.
 */
export namespace EventMocks {
  export const PickupBasketball = {
    host: EventAttendeeMocks.Alivs,
    id: randomIntegerInRange(0, 10000),
    title: "Pickup Basketball",
    description: "I'm better than Lebron James.",
    color: ColorString.parse("#ABCDEF"),
    time: {
      dateRange: dateRange(
        new Date("2023-03-18T12:00:00"),
        new Date("2023-03-18T13:00:00")
      ),
      secondsToStart: dayjs.duration(3, "hours").asSeconds(),
      todayOrTomorrow: "today",
      clientReceivedTime: new Date()
    },
    settings: {
      shouldHideAfterStartDate: true,
      isChatEnabled: true
    },
    location: mockEventLocation(),
    attendeeCount: 10,
    userAttendeeStatus: "attending",
    hasArrived: false,
    joinDate: new Date(),
    isChatExpired: false,
    endedAt: null
  } as ClientSideEvent

  export const Multiday = {
    host: EventAttendeeMocks.Alivs,
    id: randomIntegerInRange(0, 10000),
    title: "Multiday Event",
    description: "This event runs for more than one day.",
    color: ColorString.parse("#ABCDEF"),
    time: {
      dateRange: dateRange(
        new Date("2023-03-18T12:00:00"),
        new Date("2023-03-21T12:00:00")
      ),
      secondsToStart: dayjs.duration(2, "days").asSeconds(),
      clientReceivedTime: new Date()
    },
    location: mockEventLocation(),
    settings: {
      shouldHideAfterStartDate: false,
      isChatEnabled: true
    },
    attendeeCount: 3,
    userAttendeeStatus: "attending",
    hasArrived: false,
    joinDate: new Date(),
    isChatExpired: false,
    endedAt: null
  } as ClientSideEvent

  export const NoPlacemarkInfo = {
    host: EventAttendeeMocks.Alivs,
    id: randomIntegerInRange(0, 10000),
    title: "No Placemark Info",
    attendeeCount: 5,
    description:
      "The placemark info should then be geocoded from the coordinates if it is not available.",
    time: {
      dateRange: dateRange(
        new Date("2023-03-18T12:00:00"),
        new Date("2023-03-18T15:00:00")
      ),
      secondsToStart: dayjs.duration(2, "days").asSeconds(),
      clientReceivedTime: new Date()
    },
    color: ColorString.parse("#ABCDEF")!,
    location: { ...mockEventLocation(), placemark: null },
    settings: {
      shouldHideAfterStartDate: false,
      isChatEnabled: true
    },
    userAttendeeStatus: "attending",
    hasArrived: false,
    joinDate: new Date(),
    isChatExpired: false,
    endedAt: null
  } as ClientSideEvent
}
