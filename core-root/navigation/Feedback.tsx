import { XMarkBackButton } from "@components/Navigation"
import { StaticScreenProps } from "@react-navigation/native"
import { HelpAndSupportView, useHelpAndSupportSettings } from "settings-boundary/HelpAndSupport"
import { UserHandle, UserID } from "TiFShared/domain-models/User"

export const helpAndSupportScreens = () => ({
  helpAndSupportScreen: {
    options: { headerLeft: XMarkBackButton, headerTitle: "" },
    screen: HelpAndSupportScreen
  }
})

type HelpAndSupportScreenProps = StaticScreenProps<{
  id: UserID | UserHandle
  method?: "navigate" | "replace"
}>

const HelpAndSupportScreen = ({ route }: HelpAndSupportScreenProps) => (
  
)
