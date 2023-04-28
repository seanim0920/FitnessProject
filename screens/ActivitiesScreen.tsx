import EventsList from "@components/EventsList"
import EventsMap, { MapRefMethods } from "@components/EventsMap"
import { Ionicon } from "@components/common/Icons"
import EventTabBar from "@components/tabBarComponents/EventTabBar"
import { useTrackUserLocation } from "@hooks/UserLocation"
import { CurrentUserEvent, EventMocks } from "@lib/events"
import {
  UserLocationTrackingUpdate,
  requestLocationPermissions
} from "@lib/location/UserLocation"
import React, { useEffect, useRef } from "react"
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { Icon } from "react-native-elements"

const MARKER_SIZE = 60

const ActivitiesScreen = () => {
  const appRef = useRef<MapRefMethods | null>(null)
  let doesWork = false
  const givenUserLocation = useTrackUserLocation()

  const recenterThing = () => {
    if (givenUserLocation?.status === "success") {
      appRef.current?.recenterToLocation({
        latitude: givenUserLocation?.location.coordinates.latitude,
        longitude: givenUserLocation?.location.coordinates.longitude
      })
    }
  }
  const events: CurrentUserEvent[] = [
    EventMocks.Multiday,
    EventMocks.NoPlacemarkInfo,
    EventMocks.PickupBasketball
  ]

  useEffect(() => {
    ;(async () => {
      const status = await requestLocationPermissions()
      if (status === false) {
      } else {
        doesWork = true
      }
    })()
  }, [])

  function checkUserLocation (
    userLocationParam: UserLocationTrackingUpdate | undefined
  ) {
    if (userLocationParam?.status === "success") {
      return {
        latitude: userLocationParam.location.coordinates.latitude,
        longitude: userLocationParam.location.coordinates.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    } else {
      return {
        latitude: 30.0,
        longitude: 30.0,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
    }
  }

  console.log(givenUserLocation)
  return (
    <>
      <EventsMap
        ref={appRef}
        style={{ width: "100%", height: "100%" }}
        initialRegion={checkUserLocation(givenUserLocation)}
        renderMarker={(item) => (
          <>
            <View
              style={[
                styles.badgeDisplay,
                {
                  backgroundColor: events.find((x) => x.id === item.id).color
                }
              ]}
            >
              <Ionicon name="people" color="white" size={10} />
              <Text style={styles.badgeText}>
                {events.find((x) => x.id === item.id).attendeeCount}
              </Text>
            </View>

            <View style={styles.whiteBackground}>
              <ImageBackground
                source={require("../assets/Windows_10_Default_Profile_Picture.svg.png")}
                style={styles.imageBackground}
              />
            </View>
          </>
        )}
        markers={events}
      />

      <TouchableOpacity onPress={recenterThing} style={styles.recenterButton}>
        <Icon name="locate-outline" type="ionicon" color="white" size={30} />
      </TouchableOpacity>

      <EventsList />
      <EventTabBar />
    </>
  )
}

const styles = StyleSheet.create({
  whiteBackground: {
    zIndex: 1,
    flex: 1,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    backgroundColor: "white",
    borderRadius: MARKER_SIZE / 2,
    alignItems: "center",
    overflow: "hidden"
  },
  imageBackground: {
    flex: 1,
    marginTop: "4%",
    position: "absolute",
    width: MARKER_SIZE - 5,
    height: MARKER_SIZE - 5,
    borderRadius: MARKER_SIZE - 5 / 2,
    alignSelf: "center",
    overflow: "hidden"
  },
  badgeDisplay: {
    zIndex: 2,
    flex: 1,
    marginLeft: 20,
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: "red",
    position: "absolute",
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "scroll"
  },
  badgeText: {
    alignSelf: "stretch",
    textAlign: "center",
    paddingHorizontal: 3,
    fontWeight: "bold",
    fontSize: 10,
    color: "white",
    fontFamily: "OpenSansBold"
  },
  recenterButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: "20%",
    right: "5%",
    borderRadius: 15,
    backgroundColor: "black"
  }
})

export default ActivitiesScreen
