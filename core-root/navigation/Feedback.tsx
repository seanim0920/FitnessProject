import { useBackButton } from "@components/Navigation"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import { UserSession } from "@user/Session"
import {
  HelpSectionView,
  useHelpAndSupportSettings
} from "settings-boundary/HelpAndSupport"

export const helpAndSupportScreens = () => ({
  helpAndSupport: {
    options: {
      headerTitle: "Help and Support"
    },
    screen: HelpAndSupportScreen
  }
})

type HelpAndSupportScreenProps = StaticScreenProps<{
  user: UserSession
}>

const HelpAndSupportScreen = ({ route }: HelpAndSupportScreenProps) => {
  const navigation = useNavigation()
  useBackButton()
  const state = useHelpAndSupportSettings({
    userSession: route.params.user
  })

  return <HelpSectionView state={state}></HelpSectionView>
}
