import React from "react";
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
import { getUser } from "../src/graphql/queries";
import { ProfileImageAndName } from './ProfileImageAndName'
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { useNavigation } from '@react-navigation/native';
import printTime from 'hooks/printTime';

var styles = require('../styles/stylesheet');

export default function PostItem({
  item,
  deletePostsAsync,
  writtenByYou,
  setPostVal,
  setIsReplying,
  setUpdatePostID,
  receiver
}) {

  const displayTime = printTime(item.createdAt);
  //console.log(parentID);

  //
  return (
    <View style={styles.secondaryContainerStyle}>
      <View style={item.isParent == 1 ? styles.spaceAround : styles.spaceAroundReply}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {
            receiver == null 
            ?
            null
            :
            <ProfileImageAndName
              style={styles.smallImageStyle}
              userId={item.userId}
            />
          }
          <View style={receiver != null && !writtenByYou ? { marginLeft: 15 } : { marginRight: 15 }}>
            <Text>{displayTime}</Text>
          </View>
        </View>
        <Text style={styles.check}>{item.description}</Text>
      </View>

      <View style={{ marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {writtenByYou ? (
          <View style={{ marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity style={[styles.unselectedButtonStyle, { borderColor: 'red' }]} color="red" onPress={() => (deletePostsAsync(item.createdAt))}>
              <Text style={[styles.unselectedButtonTextStyle, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.unselectedButtonStyle, { borderColor: 'blue' }]}
              color="blue"
              onPress={() => (setPostVal(item.description), setUpdatePostID(item.createdAt))}>
              <Text style={[styles.unselectedButtonTextStyle, { color: 'blue' }]}>Edit</Text>
            </TouchableOpacity>

          </View>
        ) : null}
        {item.isParent == 1 ?
          <TouchableOpacity style={[styles.unselectedButtonStyle, { borderColor: 'orange' }]} color="orange" onPress={() => (setPostVal(""), setIsReplying(true), setUpdatePostID(item.parentId))}>
            <Text style={[styles.unselectedButtonTextStyle, { color: 'orange' }]}>Reply</Text>
          </TouchableOpacity>
          : null
        }
      </View>
    </View>
  );
}