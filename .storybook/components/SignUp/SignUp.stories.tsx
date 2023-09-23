import {
  BASE_HEADER_SCREEN_OPTIONS,
  ChevronBackButton,
  XMarkBackButton
} from "@components/Navigation"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SettingsScreen } from "@screens/SettingsScreen/SettingsScreen"
import { ComponentMeta, ComponentStory } from "@storybook/react-native"
import {
  CreateAccountUserHandleFormView,
  CreateAccountCredentialsFormView,
  CreateAccountEndingView
} from "@auth/sign-up"
import { useEmailPhoneTextState } from "@auth/UseEmailPhoneText"
import { AuthShadedEmailPhoneTextFieldView } from "@auth/AuthTextFields"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Button } from "react-native"
import { useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { AppStyles } from "@lib/AppColorStyle"

const SignUpMeta: ComponentMeta<typeof SettingsScreen> = {
  title: "Sign Up"
}

export default SignUpMeta

type SignUpStory = ComponentStory<typeof SettingsScreen>

const Stack = createStackNavigator()

export const Basic: SignUpStory = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ ...BASE_HEADER_SCREEN_OPTIONS }}>
        <Stack.Screen name="test" component={TestScreen} />
        <Stack.Screen
          name="signUp"
          options={{ headerLeft: () => <XMarkBackButton />, title: "" }}
          component={CreateAccountCredentialsFormView}
        />
        <Stack.Screen
          name="changeHandle"
          options={{ headerLeft: () => <ChevronBackButton />, title: "" }}
          component={HandleScreen}
        />
        <Stack.Screen
          name="welcome"
          options={{ headerLeft: () => <ChevronBackButton />, title: "" }}
          component={CreateAccountEndingView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
)

const HandleScreen = () => {
  const [handle, setHandle] = useState("pinaculousprincess69")
  return (
    <CreateAccountUserHandleFormView
      currentHandleText={handle}
      onCurrentHandleTextChanged={setHandle}
      invalidHandleReason="bad-format"
    />
  )
}

const TestScreen = () => {
  const navigation = useNavigation()
  const { text, activeTextType, onTextChanged, onActiveTextTypeChanged } =
    useEmailPhoneTextState("phone")
  return (
    <ScrollView>
      <Button
        title="Create Account Form"
        onPress={() => navigation.navigate("signUp")}
      />
      <Button
        title="Change Handle Form"
        onPress={() => navigation.navigate("changeHandle")}
      />
      <Button title="Welcome" onPress={() => navigation.navigate("welcome")} />
      <AuthShadedEmailPhoneTextFieldView
        iconBackgroundColor={AppStyles.darkColor}
        value={text}
        activeTextType={activeTextType}
        onChangeText={onTextChanged}
        onActiveTextTypeChanged={onActiveTextTypeChanged}
        style={{ marginTop: 48, paddingHorizontal: 16 }}
      />
    </ScrollView>
  )
}
