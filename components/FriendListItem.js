import React, {useState} from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { ProfileImageAndName } from "./ProfileImageAndName";
import { MaterialIcons } from "@expo/vector-icons";
import computeDistance from "hooks/computeDistance";
import getLocation from "hooks/useLocation";

var styles = require("../styles/stylesheet");

export default function FriendListItem({ item, navigation, removeFriendHandler, myId }) {
  const findFriendID = (item) => {
    if (myId == item.user1) return item.user2;
    if (myId == item.user2) return item.user1;
  };
  
  const goToMessages = (item) => {
    navigation.navigate("Messages", { userId: item });
  };

  const [isSelected, setIsSelected] = useState(false);

  const alertOptions = {
    cancelable: true,
    onDismiss: () => setIsSelected(false),
  }

  return (
    <View style={isSelected && { backgroundColor: "orange" }}>
      <ProfileImageAndName
        navigationObject={navigation}
        imageStyle={{
          resizeMode: "cover",
          width: 50,
          height: 50,
          borderRadius: 0,
          alignSelf: "center",
          marginTop: 0,
        }}
        textStyle={{
          marginLeft: 15,
          fontWeight: "normal",
          fontSize: 15,
          color: "black",
        }}
        userId={findFriendID(item)}
        textLayoutStyle={{ flex: 1, flexGrow: 1 }}
        subtitleComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginLeft: 12,
              //flexShrink: 1
            }}
          >
            <TouchableOpacity
              onPress={() => {
                const title = "More Options";
                const message = "";
                const options = [
                  {
                    text: "Block    ",
                    onPress: () => {},
                  }, //if submithandler fails user won't know
                  {
                    text: "Unfriend    ",
                    onPress: () => {
                      const title =
                        "Are you sure you want to remove this friend?";
                      const options = [
                        { text: "Yes", onPress: () => {removeFriendHandler(item), setIsSelected(false)} },
                        {
                          text: "Cancel",
                          type: "cancel",
                          onPress: () => {
                            setIsSelected(false);
                          },
                        },
                      ];
                      Alert.alert(title, "", options, alertOptions);
                    },
                  }, //if submithandler fails user won't know
                  {
                    text: "    Cancel",
                    type: "cancel",
                    onPress: () => {
                      setIsSelected(false);
                    },
                  },
                ];
                Alert.alert(title, message, options, alertOptions);
                setIsSelected(true);
              }}
              style={styles.subtitleButton}
            >
              <MaterialIcons
                name="more-horiz"
                size={20}
                color={isSelected ? "black" : "gray"}
                style={{ marginRight: 4 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subtitleButton}
              onPress={() => goToMessages(findFriendID(item))}
            >
              <MaterialIcons
                name="chat"
                size={20}
                color={isSelected ? "black" : "blue"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: isSelected ? "black" : "blue",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Message
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
