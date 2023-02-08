import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Post } from "src/models"
import IconButton from "./common/IconButton"
import { ProfileImageAndName } from "./ProfileImageAndName"
import { Divider } from "react-native-elements"

interface Props {
  item: Post,
  writtenByYou: boolean,
  startTime?: Date,
  maxOccupancy?: number,
  hasInvitations: boolean,
  eventColor: string
}

const EventItem = ({
  item,
  writtenByYou,
  startTime,
  maxOccupancy,
  hasInvitations,
  eventColor
} : Props) => {
  const [requested, setRequested] = useState(false) // If user has requested to join
  const [numInvitations, setNumInvitations] = useState(0) // Number of requested invitations
  const [isHours, setIsHours] = useState(true) // If time limit has >= 1 hour left
  const [timeUntil, setTimeUntil] = useState(0) // Time (in either hours or minutes) until event starts
  const [currentCapacity, setCurrentCapacity] = useState(1) // How many users have joined event
  const [distance, setDistance] = useState(0) // Current distance user is from the event
  const NUM_OF_LINES = 5
  const CAPACITY_PERCENTAGE = 0.75

  const setTime = () => {
    if (startTime) {
      const date = new Date()
      const diffTime = Math.abs(startTime.getTime() - date.getTime())
      const diffMin = Math.ceil(diffTime / (1000 * 60))
      const diffHour = Math.ceil(diffTime / (1000 * 60 * 60))

      if (diffMin < 60) {
        setIsHours(false)
        setTimeUntil(diffMin)
      } else {
        setIsHours(true)
        setTimeUntil(diffHour)
      }
    }
  }

  useEffect(() => {
    setTime()
  }, [startTime])

  const handleRequestToJoin = () => {
    if (requested) {
      setRequested(false)
      setNumInvitations(numInvitations - 1)
    } else {
      setRequested(true)
      setNumInvitations(numInvitations + 1)
    }
  }

  return (
    <View style={styles.secondaryContainerStyle}>
      <View
        style={[styles.spaceAround, styles.nestedReply]}
      >
      {/* Header (name, profile pic, event dot, distance) */}
        <View
          style={[styles.flexRow, { paddingBottom: "2%" }]}
        >
          <ProfileImageAndName
            textStyle={{
              fontWeight: writtenByYou ? "bold" : "normal"
            }}
            style={styles.profile}
            userId={item.userId}
          />
          <IconButton
              style={styles.eventDot}
              iconName={"lens"}
              size={15}
              color={eventColor}
              onPress={() => null}
            />
          <Text style={styles.distance}>{distance} mi</Text>
        </View>

        <Divider style={styles.divider}/>

        {/* Description */}
        <View style={styles.description}>
          <Text numberOfLines={NUM_OF_LINES}
            style={{
              paddingHorizontal: "3%"
            }}
            accessibilityLabel={"description"}
          >
            {item.description}
          </Text>
        </View>

        {/* Bottom Left Icons (time until event, max occupancy) */}
        <View style={[styles.flexRow, { paddingBottom: "1%" }]}>
          <View style={[styles.flexRow, { paddingLeft: "2%" }]}>
            {startTime != null
              ? <View style={{ flexDirection: "row" }} accessibilityLabel={"time until"}>
                <IconButton
                  iconName={"query-builder"}
                  size={22}
                  color={isHours ? "grey" : "red"}
                  onPress={() => null}
                  accessibilityLabel={"time icon"}
                />
                <Text style={[
                  styles.numHours,
                  { color: isHours ? "grey" : "red" }
                ]}
                >{timeUntil}{isHours ? "hrs" : "min"}
                </Text>
              </View>
              : null
            }
            {startTime && maxOccupancy != null
              ? <IconButton
                style={styles.paddingDot}
                iconName={"lens"}
                size={7}
                color={"grey"}
                onPress={() => null}
              />
              : null
            }
            {maxOccupancy
              ? <View style={styles.maxLimit} accessibilityLabel={"max occupancy"}>
                <IconButton
                  iconName={"person-outline"}
                  size={22}
                  color={(currentCapacity >= Math.floor(maxOccupancy * CAPACITY_PERCENTAGE))
                    ? "red"
                    : "grey"}
                  onPress={() => null}
                  accessibilityLabel={"occupancy icon"}
                />
                <Text style={[
                  { textAlignVertical: "center" },
                  {
                    color: (currentCapacity >= Math.floor(maxOccupancy * CAPACITY_PERCENTAGE))
                      ? "red"
                      : "grey"
                  }
                ]}>{currentCapacity}/{maxOccupancy}</Text>
              </View>
              : null
            }
          </View>

          {/* Bottom Right Icons (invitations, comments, more tab) */}
          <View style={styles.iconsBottomRight}>
            {hasInvitations
              ? <View style={styles.iconsBottomRight} accessibilityLabel={"request invitations"}>
                <Text
                  style={[
                    styles.numbersBottomRight,
                    { color: requested ? eventColor : "black" }
                  ]}
                  accessibilityLabel={"invitations requested"}
                >{numInvitations > 0 ? numInvitations : null}</Text>
                <IconButton
                  style={{ paddingLeft: "6%" }}
                  iconName={"person-add"}
                  size={22}
                  color={requested ? eventColor : "black"}
                  onPress={handleRequestToJoin}
                  accessibilityLabel={"invitation icon"}
                />
              </View>
              : null
            }
            <Text style={styles.numbersBottomRight}>0</Text>
            <IconButton
              style={{ paddingLeft: "3%" }}
              iconName={"messenger"}
              size={18}
              color={"black"}
              onPress={() => null}
              accessibilityLabel={"comments icon"}
            />
            <IconButton
              style={{ paddingLeft: "3%" }}
              iconName={"more-vert"}
              size={24}
              color={"black"}
              onPress={() => null}
              accessibilityLabel={"more icon"}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(EventItem)

const styles = StyleSheet.create({
  secondaryContainerStyle: {
    backgroundColor: "#f7f7f7"
  },
  spaceAround: {
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flex: 1,
    flexDirection: "column"
  },
  flexRow: {
    flex: 1,
    flexDirection: "row"
  },
  distance: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    textAlign: "right",
    paddingRight: "4%",
    paddingTop: "2%"
  },
  divider: {
    width: "94%",
    height: 1,
    alignSelf: "center"
  },
  description: {
    paddingBottom: "3%",
    paddingTop: "2%"
  },
  iconsBottomRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  numbersBottomRight: {
    paddingRight: 3,
    textAlignVertical: "center"
  },
  paddingDot: {
    paddingTop: "2%",
    paddingRight: "3%",
    paddingLeft: "1.5%"
  },
  eventDot: {
    paddingRight: "2%",
    paddingTop: "2%"
  },
  profile: {
    flexDirection: "row",
    paddingLeft: "3%",
    paddingTop: "2%"
  },
  maxLimit: {
    flexDirection: "row"
  },
  numHours: {
    textAlignVertical: "center",
    paddingLeft: "1%"
  },
  nestedReply: {
    marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  }
})
