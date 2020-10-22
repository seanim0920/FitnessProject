import React, { useState } from "react";
import { Storage } from "aws-amplify";
import {
  StyleSheet,
  View,
  Button,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

var styles = require("../styles/stylesheet");

export default function ListGroupItem({ item, check }) {

  const navigation = useNavigation();
  console.log(check);

  const goToGroupPosts = () => {
    console.log(item);
    navigation.navigate('Group Posts Screen', {group: item})
  }

  if (item.Privacy == "Public") {
    return (
      <TouchableOpacity
      style={[styles.secondaryContainerStyle]}
      onPress={goToGroupPosts}>
      <View style={styles.secondaryContainerStyle}>
        <View
          style={[
            {
              flexBasis: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginHorizontal: 25,
            },
            styles.check,
          ]}
        >
          <Text>{item.name}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
}
