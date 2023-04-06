import {
  UserLocationTrackingUpdate,
  UserLocationTrackingAccurracy,
  UserLocationDependencyKeys
} from "@lib/location/UserLocation"
import { useDependencyValue } from "@lib/dependencies"
import { useEffect, useState } from "react"

/**
 * A type for tracking the current user's location in the UI.
 */
export type UserLocationStatus = UserLocationTrackingUpdate | { status: "undetermined" }

/**
 * A hook to observe the user's current location using the
 * `UserLocationDependencyKeys.track` dependency.
 *
 * @param accurracy The accurracy at which to track the user's location.
 * Defaults to `approximate-low`.
 */
export const useUserLocation = (
  accurracy: UserLocationTrackingAccurracy = "approximate-low"
) => {
  const trackLocation = useDependencyValue(UserLocationDependencyKeys.track)
  const [location, setLocation] = useState<UserLocationStatus>({
    status: "undetermined"
  })

  useEffect(
    () => trackLocation(accurracy, setLocation),
    [trackLocation, accurracy]
  )

  return location
}
