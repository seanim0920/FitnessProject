import React, { useState, useEffect, useRef, PureComponent } from "react";
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
import { API, graphqlOperation } from "aws-amplify";
import { createLike, deleteLike } from "root/src/graphql/mutations";
import { useNavigation } from '@react-navigation/native';
import printTime from 'hooks/printTime';

var styles = require('../styles/stylesheet');

function LikeButton({
  likes,
  likedByYou,
  postId
}) {
  const [liked, setLiked] = useState(likedByYou);

  useEffect(() => {
    console.log("has the user liked this post? ", likedByYou);
    if (liked) {
      likes = likes - 1;
    }
  }, [])
  
  const likePostAsync = async () => {
    try {
      if (liked) {
        await API.graphql(graphqlOperation(deleteLike, { input: { userId: "0", postId: postId, } }));
        console.log("success in unliking post");
      } else {
        await API.graphql(graphqlOperation(createLike, { input: { postId: postId, } }));
        console.log("success in liking post");
      }
      setLiked(!liked);
    } catch (err) {
      console.log(err);
      alert('Could not be submitted!');
    }
  }

  if (liked) {
    return (
      <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: 'red' }]} color="red" onPress={likePostAsync}>
        <Text style={[styles.unselectedButtonTextStyle, { color: 'white' }]}>{likes ? likes + 1 : 1}</Text>
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableOpacity style={[styles.unselectedButtonStyle, { borderColor: 'red' }]} color="red" onPress={likePostAsync}>
        <Text style={[styles.unselectedButtonTextStyle, { color: 'red' }]}>{likes ? likes : 0}</Text>
      </TouchableOpacity>
    )
  }
}

export default function PostItem({
  item,
  deletePostsAsync,
  writtenByYou,
  setPostVal,
  setIsReplying,
  setUpdatePostID,
  receiver,
  showTimestamp,
  newSection
}) {
  const displayTime = printTime(item.createdAt);
  const isReceivedMessage = receiver != null && !writtenByYou;
  //console.log(parentID);

  //
  if (receiver == null)
    return (
      <View style={styles.secondaryContainerStyle}>
        <View style={item.isParent == 1 ? styles.spaceAround : styles.spaceAroundReply}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProfileImageAndName
              style={styles.smallImageStyle}
              userId={item.userId}
            />
            <View style={{ marginRight: 15 }}>
              <Text>{displayTime}</Text>
            </View>
          </View>
          <Text style={[styles.check]}>{item.description}</Text>
        </View>

        <View style={{ marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <LikeButton
            likes={item.likes}
            likedByYou={item.likedByYou}
            postId={item.createdAt + item.userId}
          />
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
  else {
    /*
    showTimestamp
          ? {
            paddingHorizontal: 25,
            marginTop: 10,
            marginBottom: 40,
          }
          : newSection
            ? {
              paddingHorizontal: 25,
              marginTop: 40,
              marginBottom: 10,
            }
            : {
              paddingHorizontal: 25,
              paddingTop: 10,
              paddingBottom: 10,
            }
    */
    return (
      <View style={[styles.secondaryContainerStyle, { backgroundColor: '#fff' }]}>
        <View style={[styles.spaceAround]}>
          <View
            style={
              {
                alignSelf: isReceivedMessage ? 'flex-start' : 'flex-end',
                backgroundColor: "#efefef",
                padding: 15,
                
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,

                elevation: 6,
              }
            }
          >
            <Text style={{ color: '#000' }}>{item.description}</Text>
          </View>
          <View>
            <Text style={{ color: '#000', marginTop: 15, textAlign: isReceivedMessage ? 'left' : 'right' }}>{displayTime}</Text>
          </View>
        </View>
      </View>
    );
  }
}