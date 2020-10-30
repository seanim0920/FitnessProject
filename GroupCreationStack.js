import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import GroupSearchScreen from "./GroupSearchScreen";
import CreatingGroups from "screens/CreatingGroups";
import GroupPostsScreen from "./screens/GroupPostsScreen";
import LookupUserScreen from "screens/LookupUser";

import React from 'react';

// Get the aws resources configuration parameters
import awsconfig from 'root/aws-exports'; // if you are using Amplify CLI
import { Amplify } from "aws-amplify";

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

export default function GroupSearchStack({route}) {
  const {id} = route.params
  
  //console.log("hello");
  //console.log(id);
  return (
    <Stack.Navigator initialRouteName='Search' screenOptions={{ headerStyle: { backgroundColor: '#d3d3d3' } }}>
      <Stack.Screen name='Search' component={GroupSearchScreen}/>
      <Stack.Screen name='Lookup' component={LookupUserScreen} />
      <Stack.Screen name='Create Group' component={CreatingGroups} />
      <Stack.Screen name='Group Posts Screen' component={GroupPostsScreen} initialParams={route.params}/>
    </Stack.Navigator>
  );
}