import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { ProfileImageAndName } from "./ProfileImageAndName";
import { MaterialIcons } from "@expo/vector-icons";
import computeDistance from "hooks/computeDistance";
import getLocation from "hooks/useLocation";

var styles = require("../styles/stylesheet");

export default function FriendListItem({
  item,
  navigation,
  removeFriendHandler,
  friendId,
}) {
  const goToMessages = (id) => {
    navigation.navigate("Messages", { userId: id });
  };

  const [isSelected, setIsSelected] = useState(false);

  const alertOptions = {
    cancelable: true,
    onDismiss: () => setIsSelected(false),
  };

  return (
    <View>
      <View
        style={[
          { flexDirection: "row", alignItems: "flex-start" },
          isSelected && { backgroundColor: "orange" },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            const title = "More Options";
            const message = "";
            const options = [
              {
                text: "Block",
                onPress: () => {},
              }, //if submithandler fails user won't know
              {
                text: "Unfriend",
                onPress: () => {
                  const title = "Are you sure you want to remove this friend?";
                  const options = [
                    {
                      text: "Yes",
                      onPress: () => {
                        removeFriendHandler(item), setIsSelected(false);
                      },
                    },
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
                text: "Cancel",
                type: "cancel",
                onPress: () => {
                  setIsSelected(false);
                },
              },
            ];
            Alert.alert(title, message, options, alertOptions);
            setIsSelected(true);
          }}
          style={{ alignSelf: "center", paddingHorizontal: 8}}
        >
          <MaterialIcons
            name="more-vert"
            size={20}
            color={isSelected ? "black" : "gray"}
          />
        </TouchableOpacity>
        <ProfileImageAndName
          navigationObject={navigation}
          style={{ flex: 1 }}
          imageStyle={{
            resizeMode: "cover",
            width: 50,
            height: 50,
            alignSelf: "center",
          }}
          imageLayoutStyle={{marginLeft: 0}}
          textStyle={{
            fontWeight: "normal",
            fontSize: 15,
            color: "black",
          }}
          userId={friendId}
          textLayoutStyle={{ flex: 1, flexGrow: 1 }}
          subtitleComponent={
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={styles.subtitleButton}
                onPress={() => goToMessages(friendId)}
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
      <View
        style={{ height: 1, backgroundColor: "#efefef", marginHorizontal: 12 }}
      ></View>
    </View>
  );
}
