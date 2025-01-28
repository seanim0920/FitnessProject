import { BASE_HEADER_SCREEN_OPTIONS } from "@components/Navigation"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { eventDetailsScreens } from "./EventDetails"
import { profileScreens } from "./Profile"
import { editEventScreens } from "./EditEvent"

export const ModalStack = createNativeStackNavigator({
  screenOptions: () => BASE_HEADER_SCREEN_OPTIONS,
  screens: {
    ...editEventScreens(),
    ...eventDetailsScreens(),
    ...profileScreens()
  }
})
