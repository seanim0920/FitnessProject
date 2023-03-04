import React, { useEffect, useRef, useState } from "react"
import { ListRenderItemInfo, StyleSheet, View } from "react-native"
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet"
import { Event } from "@lib/events/Event"
import EventItem from "@components/EventItem"
import NearbyActivities from "./headerComponents/NearbyActivities"
import { eventsDependencyKey } from "@lib/events/Events"
import { useDependencyValue } from "@lib/dependencies"

const EventsList = () => {
  const eventItems = useDependencyValue(eventsDependencyKey)
  const ids = Array.from(new Array(5), (_, i) => String(i))
  const events = eventItems.eventsWithIds(ids)

  // hooks
  const sheetRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    sheetRef?.current?.present()
  }, [])

  // variables
  const snapPoints = ["4%", "65%", "100%"]

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={false}
        >
          <BottomSheetFlatList
            data={events}
            renderItem={({ item }: ListRenderItemInfo<Event>) => (
              <View style={styles.secondaryContainerStyle}>
                <EventItem event={item} />
              </View>
            )}
            ListHeaderComponent={<NearbyActivities />}
            stickyHeaderIndices={[0]}
          />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  secondaryContainerStyle: {
    backgroundColor: "white",
    paddingHorizontal: "2%",
    paddingVertical: 24
  }
})

export default EventsList
