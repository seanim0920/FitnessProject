import { XMarkBackButton } from "@components/Navigation"
import { StaticScreenProps } from "@react-navigation/native"
import { UserSession } from "@user/Session"
import {
  HelpSectionView,
  useHelpAndSupportSettings
} from "settings-boundary/HelpAndSupport"

export const helpAndSupportScreens = () => ({
  helpAndSupport: {
    options: {
      headerLeft: XMarkBackButton,
      headerTitle: ""
    },
    screen: HelpAndSupportScreen
  }
})

type HelpAndSupportScreenProps = StaticScreenProps<{
  user: UserSession
}>

const HelpAndSupportScreen = ({ route }: HelpAndSupportScreenProps) => {
  const state = useHelpAndSupportSettings({
    userSession: route.params.user
  })

  return <HelpSectionView state={state}></HelpSectionView>
}
