import { AttendeeEntry } from "@components/attendeesList/attendeeEntry"
import IconButton from "@components/common/IconButton"
import { EventAttendee } from "@lib/events"
import React from "react"
import { FlatList, View } from "react-native"
import { Divider } from "react-native-elements"

const someData: EventAttendee[] = [
  {
    id: "1",
    username: "Cool"
  },
  {
    id: "2",
    username: "Also cool"
  }
]

function goBack () {
  // Presumably use navigate back to the previous screen you were on
}

// Take in a eventAttendee[] as a prop

export const AttendeesListScreen = () => {
  // List of attendees

  // Button that would let you go back, goes on the top left
  // Could also use setOptions in navigation itself, for headerLeft
  const FlatSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#000"
        }}
      />
    )
  }

  return (
    <View>
      <IconButton iconName="height" onPress={goBack} />
      <FlatList
        ItemSeparatorComponent={FlatSeparator}
        data={someData}
        renderItem={({ item }) => <AttendeeEntry attendee={item} />}
      />
    </View>
  )
}
