import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './src/screens/ProfileScreen'
import BioScreen from './src/screens/BioScreen'
import GoalsScreen from './src/screens/GoalsScreen'


import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, Button, Image, View, TextInput } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
// Get the aws resources configuration parameters
import awsconfig from './aws-exports'; // if you are using Amplify CLI
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { createUser, updateUser, deleteUser } from './src/graphql/mutations';
import { listUsers } from './src/graphql/queries';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

const App = () => {	
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = 'Profile' screenOptions={{ headerStyle: {backgroundColor: '#d3d3d3'} }}>
        <Stack.Screen name = 'Profile' component = {ProfileScreen}/>
		    <Stack.Screen name = 'Bio' component = {BioScreen} />
        <Stack.Screen name = 'Goals' component = {GoalsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
