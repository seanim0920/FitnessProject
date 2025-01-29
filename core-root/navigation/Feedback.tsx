import { useBackButton } from "@components/Navigation"
import { WithAlphaRegistrationProps } from "@core-root/AlphaRegister"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import {
  HelpAndSupportView,
  useHelpAndSupportSettings
} from "settings-boundary/HelpAndSupport"
import { UserID } from "TiFShared/domain-models/User"

export const helpAndSupportScreens = () => ({
  helpAndSupport: {
    options: {
      headerTitle: "Help and Support"
    },
    screen: HelpAndSupportScreen
  }
})

type RoutableHelpAndSupportScreenValues = {
  id: UserID
}

type HelpAndSupportScreenProps = WithAlphaRegistrationProps<
  StaticScreenProps<RoutableHelpAndSupportScreenValues>
>

const HelpAndSupportScreen = ({ route }: HelpAndSupportScreenProps) => {
  const navigation = useNavigation()
  useBackButton()
  const state = useHelpAndSupportSettings({
    userID: route.params.id
  })

  return <HelpAndSupportView state={state}></HelpAndSupportView>
}
