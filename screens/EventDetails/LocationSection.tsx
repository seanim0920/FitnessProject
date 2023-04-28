import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from "expo-clipboard"
import Toast from "react-native-root-toast"
import { Headline, Caption } from "@components/Text"
import {
  LocationCoordinate2D,
  Placemark,
  placemarkToFormattedAddress
} from "@lib/location"
import { useTrackUserLocation } from "@hooks/UserLocation"
import { EventMapDetails, withDirections } from "@lib/ExternalMap"

interface LocationSectionProps {
  color: string
  placemark?: Placemark
  coordinates: LocationCoordinate2D
}

const LocationSection = ({
  color,
  placemark,
  coordinates
}: LocationSectionProps) => {
  const userLocation = useTrackUserLocation("precise")
  
  const mapDetails: EventMapDetails = {
    coordinates: coordinates,
    placemark: placemark
  }

  const hitSlopInset = {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10
  }

  const openMapWithDirections = async () => {
    await withDirections(userLocation, mapDetails)
  }

  const copyToClipboard = async () => {
    if (placemark) {
      await Clipboard.setStringAsync(placemarkToFormattedAddress(placemark)!)
    } else {
      await Clipboard.setStringAsync(
        `${coordinates.latitude}, ${coordinates.longitude}`
      )
    }

    Toast.show("Copied to Clipboard", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    })
  }

  return (
    <View style={[styles.flexRow, styles.paddingIconSection]}>
      <View style={{ justifyContent: "center" }}>
        <Ionicons
          style={[styles.iconStyling, { backgroundColor: color }]}
          name="location"
          color={"white"}
          size={24}
        />
      </View>
      {placemark
        ? (
          <View style={styles.spacing}>
            <View style={{ marginBottom: 4 }}>
              <Headline>{placemark.name}</Headline>
              <View style={styles.flexRow}>
                {placemark.streetNumber && (
                  <Caption>{`${placemark.streetNumber} `}</Caption>
                )}
                {placemark.street && <Caption>{`${placemark.street}, `}</Caption>}
                {placemark.city && <Caption>{`${placemark.city}, `}</Caption>}
                {placemark.region && <Caption>{`${placemark.region}`}</Caption>}
              </View>
            </View>
            <View style={styles.flexRow}>
              <TouchableOpacity onPress={copyToClipboard} hitSlop={hitSlopInset}>
                <Caption
                  style={[{ color, marginRight: 16 }, styles.captionLinks]}
                  
                >
                Copy Address
                </Caption>
              </TouchableOpacity>
              <TouchableOpacity onPress={openMapWithDirections} hitSlop={hitSlopInset}>
                <Caption style={[{ color }, styles.captionLinks]}>
                Directions
                </Caption>
              </TouchableOpacity>
            </View>
          </View>
        )
        : (
          <View style={styles.spacing}>
            <View style={{ marginBottom: 4 }}>
              <Headline>{`${coordinates.latitude}, ${coordinates.longitude}`}</Headline>
              <View style={styles.flexRow}>
                <Caption>Unknown Address</Caption>
              </View>
            </View>
            <View style={styles.flexRow}>
              <TouchableOpacity onPress={copyToClipboard} hitSlop={hitSlopInset}>
                <Caption
                  style={[{ color, marginRight: 16 }, styles.captionLinks]}
                >
                Copy Coordinates
                </Caption>
              </TouchableOpacity>
              <TouchableOpacity onPress={openMapWithDirections} hitSlop={hitSlopInset}>
                <Caption style={[{ color }, styles.captionLinks]}>
                Directions
                </Caption>
              </TouchableOpacity>
            </View>
          </View>
        )}
    </View>
  )
}

export default LocationSection

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row"
  },
  paddingIconSection: {
    paddingHorizontal: 16
  },
  iconStyling: {
    padding: 6,
    borderRadius: 12
  },
  spacing: {
    paddingHorizontal: 16
  },
  captionLinks: {
    opacity: 1,
    fontWeight: "bold"
  }
})
