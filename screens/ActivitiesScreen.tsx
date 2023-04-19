import EventsList from "@components/EventsList"
import Map from "@components/Map"
import EventTabBar from "@components/tabBarComponents/EventTabBar"
import React from "react"
import { state } from "@components/MapTestData"
import {
  LocationSearchBar,
  LocationSearchPickerDependencyKeys,
  LocationSearchOption,
  LocationSearchPicker,
  mockLocationSearchOption
} from "./LocationSearch"
import { SafeAreaView } from "react-native"
import { UpdateDependencyValues } from "@lib/dependencies"
import { UserLocationDependencyKeys } from "@hooks/UserLocation"
import { mockTrackedLocationCoordinate } from "@lib/location"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const locations: LocationSearchOption[] = []

for (let i = 0; i < 20; i++) {
  locations.push(mockLocationSearchOption())
}

const ActivitiesScreen = () => {
  return (
    <>
      {/* <Map
        style={{ width: "100%", height: "100%" }}
        initialRegion={state.initialRegion}
        renderMarker={(item) => null}
        markers={state.markers}
      />
      <EventsList />
      <EventTabBar /> */}
      <SafeAreaView style={{ marginTop: 40 }}>
        <UpdateDependencyValues
          update={(values) => {
            values.set(
              UserLocationDependencyKeys.currentCoordinates,
              async () => {
                await sleep(3000)
                return mockTrackedLocationCoordinate()
              }
            )
            values.set(
              LocationSearchPickerDependencyKeys.loadOptions,
              async (query) => {
                await sleep(3000)
                return Promise.resolve(
                  locations.filter((loc) =>
                    loc.location.placemark.name?.includes(query)
                  )
                )
              }
            )
            values.set(
              LocationSearchPickerDependencyKeys.saveSelection,
              async () => {}
            )
          }}
        >
          <LocationSearchBar
            placeholder="Search Locations"
            style={{ paddingHorizontal: 16 }}
            onBackTapped={() => console.log("Exited")}
          />
          <LocationSearchPicker
            onUserCoordinatesSelected={() =>
              console.log("User location selected")
            }
            onLocationSelected={(selection) =>
              console.log("Selected Location", selection)
            }
            style={{ marginBottom: 24, marginTop: 24 }}
          />
        </UpdateDependencyValues>
      </SafeAreaView>
    </>
  )
}

export default ActivitiesScreen
