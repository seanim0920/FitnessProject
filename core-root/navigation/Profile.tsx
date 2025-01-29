import { TouchableIonicon } from "@components/common/Icons"
import { useBackButton } from "@components/Navigation"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import { useUserSession } from "@user/Session"
import React, { useEffect } from "react"
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

type ProfileScreenProps = StaticScreenProps<{
  id: UserID | UserHandle
}>

const ProfileScreen = ({ route }: ProfileScreenProps) => {
  const navigation = useNavigation()
  const { userSession } = useUserSession()
  useBackButton()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableIonicon
          onPress={async () =>
            navigation.navigate("helpAndSupport", { user: await userSession() })
          }
          icon={{ name: "settings" }}
        />
      )
    })
  }, [navigation, userSession])
  return (
    <UserProfileView
      userInfoState={useUserProfile({ userId: route.params.id.toString() })}
      upcomingEventsState={useUpcomingEvents({
        userId: route.params.id.toString()
      })}
      onRelationStatusChanged={(e) => console.log(e)}
    />
  )
}
