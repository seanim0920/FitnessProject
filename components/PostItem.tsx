import API, { graphqlOperation } from "@aws-amplify/api";
import { APIListOperations } from "@components/APIList";
import { deletePost, updatePost } from "@graphql/mutations";
import React, { useRef, useState, useEffect } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Post } from "src/models";
import IconButton from "./common/IconButton";
import Modal, { ModalRefType } from "./common/Modal";
import CommentsModal from "./postComponents/CommentsModal";
import LikesModal from "./postComponents/LikesModal";
import PostHeader from "./postComponents/PostHeader";
import PostImage from "./PostImage";
import { ProfileImageAndName } from "./ProfileImageAndName";
import TextWithTaggedUsers from "./TextWithTaggedUsers";
import printTime from "@hooks/printTime";
import { Divider } from "react-native-elements";
import useGenerateRandomColor from "@hooks/generateRandomColor";


const updatePostAWS = async (createdAt: string, editedText: string) => {
  try {
    await API.graphql(
      graphqlOperation(updatePost, {
        input: { createdAt: createdAt, description: editedText },
      })
    );
    console.log("success in updating a post");
  } catch (err) {
    console.warn("error in updating post: ", err);
  }
};

const deletePostAWS = async (createdAt: string) => {
  try {
    await API.graphql(
      graphqlOperation(deletePost, {
        input: { createdAt: createdAt, userId: globalThis.myId },
      })
    );
    console.log("success in deleting a post");
  } catch {
    console.log("error in deleting post: ");
  }
};

interface Props {
  item: Post & {taggedUsers?: string[]; likedByYou?: boolean},
  likes: number,
  reportPost: (timestamp: string, author: string) => Promise<any>,
  replyButtonHandler?: () => void,
  writtenByYou: boolean,
  isVisible?: boolean,
  shouldSubscribe?: boolean,
  operations: APIListOperations<Post>,
}

const PostItem = ({
  item,
  writtenByYou,
  replyButtonHandler,
  //receiver,
  //showTimestamp,
  //newSection,
  reportPost,
  isVisible,
  shouldSubscribe,
  likes,
  //replies,
  //index,
  operations,
} : Props) => {
  //const {removeItem, replaceItem} = operations;
  const {color, generateColor} = useGenerateRandomColor();
  //const likesModalRef = useRef<ModalRefType>(null);
  //const repliesModalRef = useRef<ModalRefType>(null);
  //const [isEditing, setIsEditing] = useState(false);
  //const [editedText, setEditedText] = useState("");
  const [requested, setRequested] = useState(false);
  const [hasTimeLimit, setHasTimeLimit] = useState(true); // If post has time limit
  const [hasMaxLimit, setHasMaxLimit] = useState(true); // If post has maximum occupancy
  const [hasInvitation, setHasInvitation] = useState(true); // If post has required invitations
  const [numInvitations, setHasNumInvitations] = useState(1) // Number of requested invitations
  const [isHours, setIsHours] = useState(true); // If time limit has >= 1 hour left
  const [currentCapacity, setCurrentCapacity] = useState(5);
  const maxCapacity = 8;
  const NUM_OF_LINES = 5;
  const CAPACITY_PERCENTAGE = 0.75;

  useEffect(() => {
    generateColor();
  }, []);

  return (
    <View style={styles.secondaryContainerStyle}>
      <View
        style={[styles.spaceAround, replyButtonHandler ? {} : styles.nestedReply]}
      >
      {/* Header (name, profile pic, event dot, distance) */}
        <View
          style={[styles.flexRow, {paddingBottom: '2%'}]}
        >
          <ProfileImageAndName
            textStyle={{
              fontWeight: writtenByYou ? "bold" : "normal",
            }}
            style={styles.profile}
            userId={item.userId}
          />
          <IconButton
              style={styles.eventDot}
              iconName={"lens"}
              size={15}
              color={color}
              onPress={() => null}
            />
          <Text style={styles.distance}>0 mi</Text>
        </View>

        <Divider style={styles.divider}/>

        {/* Description */}
        <View style={styles.description}>
          <Text numberOfLines={NUM_OF_LINES}
            style={{
              paddingHorizontal: '3%'
            }}
          >
            {item.description}
          </Text>
        </View>

        {/* Bottom Left Icons (time until event, max occupancy) */}
        <View style={styles.flexRow}>
          <View style={[styles.flexRow, {paddingLeft: '2%'}]}>
            {hasTimeLimit ?
              <View style={{flexDirection: 'row'}}>
                <IconButton
                  iconName={"query-builder"}
                  size={22}
                  color={isHours ? 'grey' : 'red'}
                  onPress={() => null}
                />
                <Text style={[
                    styles.numHours,
                    {color: isHours ? 'grey' : 'red'}
                  ]}>
                  0{isHours ? 'hrs' : 'min'}
                </Text>
              </View> : null
            }
            {hasTimeLimit && hasMaxLimit ?
              <IconButton
                style={styles.paddingDot}
                iconName={"lens"}
                size={7}
                color={"grey"}
                onPress={() => null}
              /> : null
            }
            {hasMaxLimit ?
              <View style={styles.maxLimit}>
                <IconButton 
                  iconName={"person-outline"}
                  size={22}
                  color={(currentCapacity >= Math.floor(maxCapacity*CAPACITY_PERCENTAGE))
                    ? 'red' : 'grey'}
                  onPress={() => null}
                />
                <Text style={[
                    {textAlignVertical:'center'},
                    {color: (currentCapacity >= Math.floor(maxCapacity*CAPACITY_PERCENTAGE))
                      ? 'red' : 'grey'
                    }
                  ]}>{currentCapacity}/{maxCapacity}</Text>
              </View> : null
            }
          </View>

          {/* Bottom Right Icons (invitations, comments, more tab) */}
          <View style={styles.iconsBottomRight}>
            {hasInvitation ?
              <View style={styles.iconsBottomRight
              }>
                <Text 
                  style={[
                    styles.numbersBottomRight,
                    {color: requested ? color : "black"}
                  ]}
                >{numInvitations > 0 ? numInvitations : null}</Text>
                <IconButton
                  style={{paddingLeft: '6%'}}
                  iconName={"person-add"}
                  size={22}
                  color={requested ? color : "black"}
                  onPress={() => setRequested(!requested)}
                />
              </View> : null
            }
            <Text style={styles.numbersBottomRight}>0</Text>
            <IconButton
              style={{paddingLeft: '3%'}}
              iconName={"messenger"}
              size={18}
              color={"black"}
              onPress={() => null}
            />
            <IconButton
              style={{paddingLeft: '3%'}}
              iconName={"more-vert"}
              size={24}
              color={"black"}
              onPress={() => null}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PostItem);

const styles = StyleSheet.create({
  secondaryContainerStyle: {
    backgroundColor: "#a9efe0"
  },
  spaceAround: {
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flex: 1,
    flexDirection: 'column'
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row'
  },
  distance: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'right',
    paddingRight: '4%',
    paddingTop: '2%'
  },
  divider: {
    width: '94%',
    height: 1,
    alignSelf: 'center'
  },
  description: {
    paddingBottom: '3%',
    paddingTop: '2%'
  },
  iconsBottomRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  numbersBottomRight: {
    paddingRight: 3,
    textAlignVertical:'center',
  },
  paddingDot: {
    paddingTop: '2%',
    paddingRight: '3%',
    paddingLeft: '1.5%'
  },
  eventDot: {
    paddingRight: '2%',
    paddingTop: '2%'
  },
  profile: {
    flexDirection: "row",
    paddingLeft: "3%",
    paddingTop: '2%'
  },
  maxLimit: {
    flexDirection: 'row',
  },
  numHours: {
    textAlignVertical:'center',
    paddingLeft: '1%'
  },
 /* check: {
    padding: 25,
    marginTop: 16,
    borderColor: "#bbb",
    borderWidth: 2,
    borderStyle: "solid",
  },
  unselectedButtonStyle: {
    borderWidth: 2,
    borderColor: "gray",
    alignSelf: "center",
    backgroundColor: "transparent",
    padding: 9,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonTextStyle: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 2,
    marginHorizontal: 6,
  },
  buttonStyle: {
    alignSelf: "center",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },*/
  nestedReply: {
    marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
