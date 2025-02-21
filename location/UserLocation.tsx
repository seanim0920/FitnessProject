import { QueryHookOptions } from "@lib/ReactQuery"
import { useQuery } from "@tanstack/react-query"
import {
  LocationObject,
  LocationOptions,
  PermissionResponse,
  getCurrentPositionAsync,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync
} from "expo-location"
import React, { ReactNode, createContext, useContext } from "react"
import { mergeWithPartial } from "TiFShared/lib/Object"

/**
 * A query hook to load the user's current location from expo.
 *
 * **Notice**:
 * This hook will always return an error status if the user previously
 * denied location permissions but then allowed them in settings.
 * To fix this, ensure you re-request the location permissions before calling
 * this hook.
 */
export const useUserCoordinatesQuery = (
  locationOptions: LocationOptions,
  options?: QueryHookOptions<LocationObject>
) => {
  const { getCurrentLocation } = useUserLocationFunctions()
  return useQuery({
    queryKey: ["user-coordinates", { preview: true }],
    queryFn: async () => await getCurrentLocation(locationOptions),
    ...options
  })
}

/**
 * A query hook to Request permission for location foreground permissions.
 */
export const useRequestForegroundLocationPermissions = (
  options?: QueryHookOptions<PermissionResponse>
) => {
  const { requestForegroundPermissions } = useUserLocationFunctions()
  return useQuery({
    queryKey: ["request-location-foreground-permissions"],
    queryFn: async () => await requestForegroundPermissions(),
    ...options
  })
}

/**
 * A query hook to request permission for background location permissions.
 *
 * Background location permissions first require that foreground location permissions are accepted.
 */
export const useRequestBackgroundLocationsPermissions = (
  options?: QueryHookOptions<PermissionResponse>
) => {
  const { requestBackgroundPermissions } = useUserLocationFunctions()
  return useQuery({
    queryKey: ["request-location-foreground-permissions"],
    queryFn: async () => await requestBackgroundPermissions(),
    ...options
  })
}

export type UserLocationFunctions = {
  getCurrentLocation: (options: LocationOptions) => Promise<LocationObject>
  requestForegroundPermissions: () => Promise<PermissionResponse>
  requestBackgroundPermissions: () => Promise<PermissionResponse>
}

const UserLocationFunctionsContext = createContext<UserLocationFunctions>({
  getCurrentLocation: getCurrentPositionAsync,
  requestBackgroundPermissions: requestBackgroundPermissionsAsync,
  requestForegroundPermissions: requestForegroundPermissionsAsync
})

/**
 * The current functions that handle user location based operations.
 */
export const useUserLocationFunctions = () =>
  useContext(UserLocationFunctionsContext)!

export type UserLocationFunctionsProviderProps =
  Partial<UserLocationFunctions> & {
    children: ReactNode
  }

/**
 * Provides a context of functions that operate on the user's current location.
 */
export const UserLocationFunctionsProvider = ({
  children,
  ...props
}: UserLocationFunctionsProviderProps) => (
  <UserLocationFunctionsContext.Provider
    value={mergeWithPartial(useContext(UserLocationFunctionsContext), props)}
  >
    {children}
  </UserLocationFunctionsContext.Provider>
)
