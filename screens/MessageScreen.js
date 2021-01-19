import React, { useState, useEffect, PureComponent} from "react";
import {
  Text,
  View,
  TouchableOpacity
} from "react-native";
// Get the aws resources configuration parameters
import FeedScreen from "screens/FeedScreen";

//const { width } = Dimensions.get('window');

var styles = require('styles/stylesheet');

export default function MessageScreen({ navigation, route }) {
  const { channel } = route.params;
  //console.log(route.params);
  //console.log(route);
  //have a header with the person's name and profile pic also.
  return (
    <View style={styles.containerStyle}>  
      <FeedScreen
        navigation={navigation}
        route={route}
        initialParams={route.params}
        isMessage={true}
      />
    </View>
  );
};