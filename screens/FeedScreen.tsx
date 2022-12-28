import APIList, { APIListRefType, APIListRenderItemInfo } from "@components/APIList";
import IconButton from "@components/common/IconButton";
import ExpandingTextInputWithNameInput from "@components/ExpandingTextInputWithNameInput";
import PostItem from "@components/PostItem";
import { ProfileImageAndName } from "@components/ProfileImageAndName";
import SpamButton from "@components/SpamButton";
import {
  createPost,
  createReport
} from "@graphql/mutations";
import { batchGetLikes, postsByChannel, postsByLikes } from "@graphql/queries";
import {
  onCreatePostFromChannel,
  onDeletePostFromChannel,
  onUpdatePostFromChannel
} from "@graphql/subscriptions";
import SHA256 from "@hooks/hash";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// Get the aws resources configuration parameters
import API, { GraphQLSubscription } from "@aws-amplify/api";
import { Cache, graphqlOperation, Storage } from "aws-amplify";
import { Progress } from "aws-sdk/lib/request";
import { Video } from "expo-av";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { getLinkPreview } from "link-preview-js";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image, KeyboardAvoidingView, Platform, ScrollView,
  StyleProp, StyleSheet, Text,
  View,
  ViewStyle
} from "react-native";
import { Post } from "src/models";
import usePhotos from "../hooks/usePhotos";

const linkify = require("linkify-it")();
linkify
  .tlds(require("tlds")) // Reload with full tlds list
  .tlds("mobi", true); // Add unofficial `.onion` domain

require("../androidtimerfix");

var allSettled = require("promise.allsettled");

const viewabilityConfig = {
  minimumViewTime: 150,
  itemVisiblePercentThreshold: 66,
  waitForInteraction: false,
};

interface Props {
  channel: string;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  originalParentId?: string
  isFocused?: boolean;
  postButtonLabel?: string;
  renderItem?: (i: Post) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
  isChallenge?: boolean;
  onPostAdded?: (newPost: Post) => void;
}

export default function FeedScreen({
  channel,
  headerComponent,
  footerComponent,
  originalParentId,
  isFocused = true,
  style,
  postButtonLabel,
  renderItem,
  autoFocus = false,
  isChallenge = false,
  onPostAdded,
  ...rest
}: Props) {
  const navigation = useNavigation();
  const [onlineCheck, setOnlineCheck] = useState(true);

  const scrollRef = useRef<ScrollView>(); // Used to help with automatic scrolling to top
  const listRef = useRef<APIListRefType<Post>>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (channel === "general") {
        navigation.setOptions({
          headerLeft: () => (
            <ProfileImageAndName
              isFullSize={true}
              hidename={true}
              imageSize={30}
              style={{ marginLeft: 15 }}
            />
          ),
        });
      }
    }, [])
  );

  useEffect(() => {
    const createPostSubscription = API.graphql<GraphQLSubscription<{onCreatePostFromChannel: Post}>>(
      graphqlOperation(onCreatePostFromChannel, { channel: channel })
    ).subscribe({
      next: (event) => {
        const newPost = event.value?.data?.onCreatePostFromChannel;
        if (!newPost) return;
        listRef.current?.addItem(
          newPost,
          (post) =>
            post.userId === newPost.userId &&
            post.createdAt === newPost.createdAt
        );
      },
      error: error => console.warn(error),
    });

    const deletePostSubscription = API.graphql<GraphQLSubscription<{onDeletePostFromChannel: Post}>>(
      graphqlOperation(onDeletePostFromChannel, { channel: channel })
    ).subscribe({
      next: (event) => {
        const deletedPost = event?.value?.data?.onDeletePostFromChannel;
        if (!deletedPost) return;
        listRef.current?.removeItem(
          (post) =>
            post.userId === deletedPost.userId &&
            post.createdAt === deletedPost.createdAt
        );
      },
      error: error => console.warn(error),
    });
    const updatePostSubscription = API.graphql<GraphQLSubscription<{onUpdatePostFromChannel: Post}>>(
      graphqlOperation(onUpdatePostFromChannel, { channel: channel })
    ).subscribe({
      //nvm we dont have a subscription event for incrementlike
      next: (event) => {
        //console.log("post has been updated");
      },
      error: error => console.warn(error),
    });
    checkInternetConnection();
    return () => {
      createPostSubscription.unsubscribe();
      deletePostSubscription.unsubscribe();
      updatePostSubscription.unsubscribe();
    };
  }, []);

  const getLikedPosts = async (newPosts) => {
    let postIds = [];

    newPosts.forEach((item) => {
      postIds.push({ postId: item.createdAt + "#" + item.userId });
    });

    try {
      await allSettled([
        API.graphql(graphqlOperation(batchGetLikes, { likes: postIds })).then(
          (likes) => {
            //console.log("looking for likes: ", likes);
            //returns an array of like objects or nulls corresponding with the array of newposts
            for (let i = 0; i < newPosts.length; ++i) {
              if (newPosts[i].likes == null) {
                newPosts[i].likes = 0;
              }
              if (likes.data.batchGetLikes[i] != null) {
                //console.log("found liked post");
                newPosts[i].likedByYou = true;
              } else {
                newPosts[i].likedByYou = false;
              }
            }
          }
        ),

        allSettled(newPosts.map((post) => Cache.getItem(post.userId))).then(
          (results) => {
            //console.log("all are complete")
            for (let i = 0; i < newPosts.length; ++i) {
              if (results[i].status === "fulfilled") {
                newPosts[i].info = results[i].value;
              } else {
                newPosts[i].info = { error: true };
              }
            }
          }
        ),

        allSettled(
          newPosts.map((post) => {
            if (
              linkify.pretest(post.description) &&
              linkify.test(post.description)
            )
              return getLinkPreview(linkify.match(post.description)[0].url, {
                headers: {
                  "user-agent": "googlebot", // fetches with googlebot crawler user agent
                },
              });
            else return Promise.reject();
          })
        ).then((results) => {
          //console.log(results)
          for (let i = 0; i < newPosts.length; ++i) {
            if (results[i].status === "fulfilled") {
              newPosts[i].urlPreview = results[i].value;
            }
          }
        }),
      ]);

      //console.log(newPosts[0])

      return newPosts;

      //we can also check if the item contains a link and load the link preview data through here as well, and insert it into the postitem
      //link previews should have a fixed height btw, or at least a max height. but then it could vary between 0 and the max height
    } catch (err) {
      console.log("error in detecting likes: ", err);
    }
  };

  const showTimestamp = (item: Post, index: number) => {
    return true;
  };

  const checkInternetConnection = () => {
    NetInfo.fetch().then((state) => setOnlineCheck(state.isConnected));
  };

  const DisplayInternetConnection = () => {
    console.log(onlineCheck);
    if (!onlineCheck) {
      return (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}> Not Connected to the Internet</Text>
        </View>
      );
    }
    return null;
  };

  const reportPost = async (timestamp: string, author: string) => {
    try {
      await API.graphql(
        graphqlOperation(createReport, {
          input: {
            postId: timestamp + "#" + author,
            userId: globalThis.myId,
          },
        })
      );
    } catch (err) {
      console.log("error in reporting post: ", err);
    }
  };

  // const scrollToTop = () => {
  //   scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
  // };

  const renderPostItem: APIListRenderItemInfo<Post> = ({ item, index }, operations) => {
    if (item.loading)
      return (
        <ActivityIndicator
          size="large"
          color="#000000"
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            padding: 20,
          }}
        />
      );
    else
      return (
        <PostItem
          //index={index}
          item={item}
          likes={item.likes}
          replies={item.replies}
          writtenByYou={item.userId === globalThis.myId}
          showTimestamp={showTimestamp(item, index)}
          reportPost={reportPost}
          newSection={true}
          operations={operations}
          isVisible={item.isVisible && isFocused}
        />
      );
    /*return renderItem({
        index,
        item,
        likes: item.likes,
        replies: item.replies,
        deletePostsAsync,
        writtenByYou: item.userId === myId,
        myId,
        editButtonHandler: updatePostAsync,
        receiver,
        showTimestamp: showTimestamp(item, index),
        reportPost,
        newSection: true,
        isVisible: item.isVisible && isFocused,
      });*/
  };

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems, changedItems }) => {
      if (viewableItems.length <= 0) return;

      let currentIndex = 0;

      /*
      listRef.current.filterItems((post) => {
        post.isVisible = false;
        if (
          viewableItems[currentIndex] &&
          viewableItems[currentIndex].key ===
            post.createdAt.toString() + post.userId
        ) {
          //grab the middle of the index, that's the video that should be playing (if there is any)
          //console.log("turning post visible")
          ++currentIndex;
          post.isVisible = true;
        }

        return post;
      });
      */

      //in the postitem have a useeffect listening for the subscription flag to turn on and off subscriptions for that post
    },
    []
  );

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <APIList
      {...rest}
      ref={listRef}
      style={[{ flex: 1 }, style]}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      ListRef={scrollRef}
      ListFooterComponent={footerComponent}
      ListHeaderComponent={
        <View style={{}}>
          <KeyboardAvoidingView
            enabled={rest.inverted}
            behavior={Platform.OS === "ios" ? "position" : "height"}
            keyboardVerticalOffset={90}
            style={{ flex: 1 }}
          >
            <PostInputField
              onPostAdded={(newPost: Post) => {listRef.current?.addItem({...newPost, 
              userId: globalThis.myId,
              createdAt: "null",
              loading: true,
            }); onPostAdded?.(newPost);}}
              channel={channel}
              originalParentId={originalParentId}
              autoFocus={autoFocus}
              isChallenge={isChallenge}
              label={postButtonLabel}
            />
          </KeyboardAvoidingView>
          {headerComponent}
        </View>
      }
      initialAmount={7}
      additionalAmount={7} //change number based on device specs
      processingFunction={getLikedPosts}
      queryOperation={isChallenge ? postsByLikes : postsByChannel}
      queryOperationName={isChallenge ? "postsByLikes" : "postsByChannel"}
      filter={{ channel: channel, sortDirection: "DESC" }}
      renderItem={renderPostItem}
      keyExtractor={(item) => item.createdAt.toString() + item.userId}
      onEndReachedThreshold={0.5}
    />
  );
}

function PostInputField({
  channel,
  label,
  originalParentId,
  autoFocus = false,
  isChallenge = false,
  onPostAdded,
}) {
  const [pickFromGallery, pickFromCamera] = usePhotos(!isChallenge, true);
  const [postInput, setPostInput] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [imagePartialURL, setImagePartialURL] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(null);
  const [postIsLoading, setPostIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const [taggedUsers, setTaggedUsers] = useState<string[]>();

  let animation = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false, // Add This line
    }).start();
  }, [progress]);

  const width = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  const addPostAsync = async () => {
    setPostIsLoading(true);

    const imageID = SHA256(Date.now().toString());
    
    let imageURL;
    let videoExtension;
    if (imagePartialURL !== null) {
      const re = /(?:\.([^.]+))?$/;
      videoExtension = re.exec(imagePartialURL)?.[1];

      imageURL = `${imageID}.${isVideo ? videoExtension : "jpg"}`;
    }

    let newPost: Partial<Post> & {taggedUsers?: string[]} = {
      description: postInput,
      channel: channel,
      parentId: originalParentId ?? undefined,
      taggedUsers,
      imageURL,
    };

    setTaggedUsers([]);
    setPostInput("");
    setText("");

    //pushLocalPost(localNewPost);

    //if (global.updatemessagescreen)
    //global.updateMessageScreen
    //if global.updateconversationscreen
    //global.updateConversationScreen

    try {
      //first, we must upload the image if any
      if (imagePartialURL) {
        let blob;
        if (!isVideo) {
          const resizedPhoto = await ImageManipulator.manipulateAsync(
            imagePartialURL,
            [{ resize: { width: 500 } }],
            { compress: 1, format: SaveFormat.JPEG }
          );
          const response = await fetch(resizedPhoto.uri);
          blob = await response.blob();
        } else {
          const response = await fetch(imagePartialURL);
          blob = await response.blob();
        }

        setProgress(0.01);
        await Storage.put(
          `feed/${imageURL}`,
          blob,
          {
            progressCallback(progress: Progress) {
              setProgress(progress.loaded / progress.total);
              //console.log(progress); //what is "part"
            },
            level: "public",
            contentType: isVideo ? "video/" + videoExtension : "image/jpeg",
          }
        ); //make sure people can't overwrite other people's photos, and preferrably not be able to list all the photos in s3 using brute force. may need security on s3
        setProgress(0);
        setImagePartialURL(null);
      }

      onPostAdded?.(newPost); //should go before or after api operation?

      API.graphql(graphqlOperation(createPost, { input: newPost }));
    } catch (err) {
      console.warn("error in creating post: ", err);
    }

    setPostIsLoading(false);
  };

  return (
    <View>
      {imagePartialURL !== null ? (
        isVideo ? (
          <Video
            style={styles.postVideo} //check if this should be an image or a video?
            useNativeControls
            isLooping
            shouldPlay
            source={{ uri: imagePartialURL }} //need a way to delete the image too
            posterSource={require("../assets/icon.png")}
          />
        ) : (
          <Image
            style={{
              resizeMode: "cover",
              width: 450,
              height: 450,
              alignSelf: "center",
            }} //check if this should be an image or a video?
            source={{ uri: imagePartialURL }} //need a way to delete the image too
          />
        )
      ) : null}

      {!isChallenge && (
        <ExpandingTextInputWithNameInput
          style={[styles.textInputStyle, { marginTop: 5, marginBottom: 5 }]}
          autoFocus={autoFocus}
          multiline={true}
          placeholder={progress > 0 ? "Uploading..." : "Start typing..."}
          onChangeText={setPostInput}
          setText={setText}
          text={text}
          taggedUsers={taggedUsers}
          setTaggedUsers={setTaggedUsers}
          value={postInput}
          clearButtonMode="always"
          maxLength={1000}
          onSubmit={(userId) =>
            !taggedUsers.includes(userId) &&
            setTaggedUsers([...taggedUsers, userId])
          }
          onDelete={(userId) =>
            taggedUsers.includes(userId) &&
            setTaggedUsers(taggedUsers.filter((user) => user != userId))
          }
        />
      )}

      <FlatList
        data={taggedUsers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ProfileImageAndName
            style={{
              alignContent: "flex-start",
              alignItems: "center",
              alignSelf: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
              marginLeft: 15,
              marginRight: 5,
            }}
            imageSize={20}
            userId={item}
          />
        )}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 15,
          marginTop: 2,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <IconButton
            iconName={"insert-photo"}
            size={20}
            color={imagePartialURL === null || postIsLoading ? "gray" : "blue"}
            style={{ marginRight: 6 }}
            onPress={() => pickFromGallery(setImagePartialURL, null, setIsVideo)}
          />
          <IconButton
            iconName={"camera-alt"}
            size={20}
            style={{ marginRight: 6 }}
            color={imagePartialURL === null || postIsLoading ? "gray" : "blue"}
            onPress={() => pickFromCamera(setImagePartialURL, null, setIsVideo)}
          />
          {imagePartialURL != null ? (
            <IconButton
              iconName={"close"}
              size={20}
              color={imagePartialURL === null || postIsLoading ? "gray" : "blue"}
              onPress={() => setImagePartialURL(null)}
            />
          ) : null}
        </View>
        <IconButton
          iconName={
            (postInput === "" && imagePartialURL === null) || postIsLoading
              ? "add-circle-outline"
              : "add-circle"
          }
          size={15}
          color={
            (postInput === "" && imagePartialURL === null) || postIsLoading
              ? "gray"
              : "blue"
          }
          label={label ?? "Add Post"}
          onPress={
            postIsLoading
              ? () => {
                  Alert.alert("Currently uploading a post");
                }
              : postInput === "" && imagePartialURL === null
              ? () => {
                  Alert.alert("No text detected in text field");
                }
              : addPostAsync
          }
        />
      </View>

      <SpamButton func={addPostAsync} />

      {progress > 0 ? (
        <View
          style={{
            height: 30,
            backgroundColor: "white",
            margin: 15,
            borderRadius: 5,
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              },
              { backgroundColor: "#26c6a2", width },
            ]}
          />
          <Text
            style={{
              alignSelf: "center",
              justifyContent: "center",
              color: "black",
              fontWeight: "bold",
              fontSize: 15,
              marginTop: 5,
            }}
          >
            Uploading...
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },
  offlineContainer: {
    backgroundColor: "#b52424",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  offlineText: { color: "#fff" },
  postVideo: {
    resizeMode: "cover",
    width: 450,
    height: 450,
    alignSelf: "center",
  },
});
