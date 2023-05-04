import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet"
import { CurrentUserEvent, EventMocks } from "@lib/events/Event"
import React, { useEffect, useRef } from "react"
import { ListRenderItemInfo, StyleSheet, View } from "react-native"
import { Title } from "./Text"
import { EventCard } from "./eventCard/EventCard"

const EventsList = () => {
  const events: CurrentUserEvent[] = [
    EventMocks.Multiday,
    EventMocks.NoPlacemarkInfo,
    EventMocks.PickupBasketball
  ]
  const MARGIN_HORIZONTAL = 24
  const MARGIN_VERTICAL = 16
  const BOTTOM_OFFSET = 80

  // hooks
  const sheetRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    sheetRef?.current?.present()
  }, [])

  // variables
  const snapPoints = ["8%", "55%", "90%"]

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          flex: 1
        }}
      >
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={false}
          bottomInset={BOTTOM_OFFSET}
        >
          <BottomSheetFlatList
            data={events}
            renderItem={({ item }: ListRenderItemInfo<CurrentUserEvent>) => (
              <View
                style={{
                  marginHorizontal: MARGIN_HORIZONTAL,
                  marginVertical: MARGIN_VERTICAL
                }}
              >
                <EventCard event={item} />
              </View>
            )}
            ListHeaderComponent={
              <View style={styles.activitiesContainer}>
                <Title style={styles.activitiesText}>Nearby Events</Title>
              </View>
            }
            stickyHeaderIndices={[0]}
          />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  activitiesContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    paddingBottom: 8
  },
  activitiesText: {
    fontSize: 18,
    marginLeft: 16,
    textAlignVertical: "top",
    fontFamily: "OpenSansBold"
  }
})

export default EventsList
