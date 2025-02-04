import { TouchableIonicon } from "@components/common/Icons"
import { useBackButton } from "@components/Navigation"
import {
  withAlphaRegistration,
  WithAlphaRegistrationProps
} from "@core-root/AlphaRegister"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import { StyleSheet } from "react-native"
import { UserHandle, UserID } from "TiFShared/domain-models/User"
import {
  UserProfileView,
  useUpcomingEvents,
  useUserProfile
} from "user-profile-boundary"

export const profileScreens = () => ({
  userProfile: {
    options: { headerTitle: "" },
    screen: ProfileScreen
  }
})

type RouteableProfileScreenValues = {
  id: UserID | UserHandle
}

type ProfileScreenProps = WithAlphaRegistrationProps<
  StaticScreenProps<RouteableProfileScreenValues>
>

const ProfileScreen = withAlphaRegistration(
  ({ session, route }: ProfileScreenProps) => {
    const navigation = useNavigation()
    useBackButton()
    if (session.id === route.params.id) {
      useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableIonicon
              onPress={() =>
                navigation.navigate("helpAndSupport", { id: session.id })
              }
              icon={{ name: "settings" }}
            />
          )
        })
      }, [navigation, session])
    }
    return (
      <UserProfileView
        userInfoState={useUserProfile({ userId: route.params.id.toString() })}
        upcomingEventsState={useUpcomingEvents({
          userId: route.params.id.toString()
        })}
        onRelationStatusChanged={(e) => console.log(e)}
        style={styles.profileScreen}
      />
    )
  }
)

const styles = StyleSheet.create({
  profileScreen: {
    padding: 16
  }
})
