import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  LogBox,
  AsyncStorage,
  Text
} from "react-native";
import { withAuthenticator } from "aws-amplify-react-native";
// Get the aws resources configuration parameters
import awsconfig from "./aws-exports"; // if you are using Amplify CLI
import { Amplify, API, graphqlOperation, Auth, Cache } from "aws-amplify";
import { getUser } from "./src/graphql/queries";
import FeedStack from "./FeedStack";
import ProfileTab from "./ProfileTab";
import ComplianceScreen from "./screens/ComplianceScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BioScreen from "./screens/BioScreen";
import GoalsScreen from "./screens/GoalsScreen";
import SignInScreen from "./screens/SignInScreen";
import SearchStack from "./SearchStack";
import { updateUser } from 'root/src/graphql/mutations.js'

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

Amplify.configure({
  awsconfig,
  Analytics: {
    disabled: true,
  },
}); //for some reason this removes the unhandled promise rejection error on startup

const config = {
  storage: AsyncStorage,
  capacityInBytes: 5000000,
};

const myCacheConfig = Cache.configure(config);
Cache.clear(); //will we have to do this for the next build?

var styles = require("./styles/stylesheet");

const App = () => {
  //Text.defaultProps = Text.defaultProps || {}
  //Text.defaultProps.style =  { fontFamily: 'Helvetica', fontSize: 15, fontWeight: 'normal' }

  const notificationListener = useRef();
  const responseListener = useRef();
  const Tab = createBottomTabNavigator();
  const [userId, setUserId] = useState('checking...'); //stores the user's id if logged in

  const checkIfUserExists = async () => {
    try {
      const query = await Auth.currentUserInfo();
      const user = await API.graphql(
        graphqlOperation(getUser, { id: query.attributes.sub })
      );
      if (user.data.getUser != null) {
        setUserId(query.attributes.sub);
      } else {
        setUserId('');
      }

      console.log("success, user is ", user);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const requestAndSaveNotificationPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Only update the profile with the expoToken if it not exists yet
    if (token !== "") {
      const inputParams = {
        id: userId,
        deviceToken: token
      };
      await API.graphql(graphqlOperation(updateUser, { input: inputParams }));
    }
  }

  useEffect(() => {
    checkIfUserExists();
  }, []);

  useEffect(() => {
    if (userId !== 'checking...' && userId !== '') {
      requestAndSaveNotificationPermissions();
    
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log("YOU GOT MAIL!");
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }
  }, [userId])

  //console.log("App rerendered, userexists is... ", userId == '');

  const Stack = createStackNavigator();

  if (userId == 'checking...') {
    return (
      <ActivityIndicator 
      size="large" 
      color="#0000ff"
      style={{
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
      }} />
    )
  } else if (userId == '') {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Compliance Forms"
            component={ComplianceScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ newUser: true, id: userId, setUserIdFunction: setUserId }}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Bio" component={BioScreen} />
          <Stack.Screen name="Goals" component={GoalsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: "orange",
            labelStyle: {
              fontSize: 20,
              fontWeight: "bold",
              margin: 0,
              padding: 0,
            },
            tabStyle: {
              height: 47,
            },
          }}
        >
          <Tab.Screen
            name="Feed"
            component={FeedStack}
            initialParams={{id: userId}}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen 
            name="Search"
            component={SearchStack}
            initialParams={{id: userId}}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen 
            name="Profile"
            component={ProfileTab}
            initialParams={{id: userId, fromLookup: false}}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
};

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon({ name, color }) {
  return (
    <Ionicons size={50} style={{ marginBottom: 0 }} {...{ name, color }} />
  );
}

export default withAuthenticator(App, false, [
  <SignInScreen />
]);