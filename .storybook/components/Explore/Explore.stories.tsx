import { EventMocks } from "@lib/events"
import {
  ExploreEventsScreensParamsList,
  ExploreEventsView,
  createExploreEventsScreens
} from "@screens/ExploreEvents"
import { ComponentMeta, ComponentStory } from "@storybook/react-native"
import { TiFQueryClientProvider } from "@components/TiFQueryClientProvider"
import React from "react"
import { UserLocationFunctionsProvider } from "@hooks/UserLocation"
import { MenuProvider } from "react-native-popup-menu"
import { createStackNavigator } from "@react-navigation/stack"
import { BASE_HEADER_SCREEN_OPTIONS } from "@components/Navigation"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync
} from "expo-location"

const ExploreEventsMeta: ComponentMeta<typeof ExploreEventsView> = {
  title: "Explore Events Screen",
  component: ExploreEventsView
}

export default ExploreEventsMeta

type ExploreEventsStory = ComponentStory<typeof ExploreEventsView>

const Stack = createStackNavigator<ExploreEventsScreensParamsList>()
const screens = createExploreEventsScreens(Stack, () => ({
  value: Promise.resolve([
    EventMocks.Multiday,
    EventMocks.NoPlacemarkInfo,
    EventMocks.PickupBasketball
  ]),
  cancel: () => {}
}))

export const Basic: ExploreEventsStory = () => (
  <MenuProvider>
    <TiFQueryClientProvider>
      <UserLocationFunctionsProvider
        getCurrentLocation={getCurrentPositionAsync}
        requestForegroundPermissions={requestForegroundPermissionsAsync}
      >
        <SafeAreaProvider>
          <NavigationContainer onStateChange={console.log}>
            <Stack.Navigator screenOptions={{ ...BASE_HEADER_SCREEN_OPTIONS }}>
              {screens}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </UserLocationFunctionsProvider>
    </TiFQueryClientProvider>
  </MenuProvider>
)
