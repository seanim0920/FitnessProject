import { createStackNavigator } from "@react-navigation/stack";
import BlockListScreen from "@screens/BlockListScreen";
import LookupUserScreen from "@screens/LookupUser";
import Settings from "@screens/SettingsScreen";
import React from "react";
import "react-native-gesture-handler";

const Stack = createStackNavigator();

export enum SettingsScreenNames {
  SETTINGS = "Settings",
  BLOCKLIST = "Block List",
  LOOKUP = "Lookup",
}

export type RootStackParamList = {
  Profile: { userId: string };
};

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={SettingsScreenNames.SETTINGS}
        component={Settings}
      />
      <Stack.Screen
        options={{ headerShown: true }}
        name={SettingsScreenNames.BLOCKLIST}
        component={BlockListScreen}
      />
      <Stack.Screen
        name={SettingsScreenNames.LOOKUP}
        component={LookupUserScreen}
      />
    </Stack.Navigator>
  );
}
