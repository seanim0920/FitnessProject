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
  SignUpChangeUserHandleFormView,
  SignUpCredentialsFormView,
  SignUpVerifyCodeView,
  SignUpEndingView,
  useSignUpChangeUserHandle
} from "@auth/sign-up"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Button, View } from "react-native"
import { useState } from "react"
import { UserHandle } from "@lib/users"
import { TiFQueryClientProvider } from "@components/TiFQueryClientProvider"
import { delayData, sleep } from "@lib/DelayData"

const SignUpMeta: ComponentMeta<typeof SettingsScreen> = {
  title: "Sign Up"
}

export default SignUpMeta

type SignUpStory = ComponentStory<typeof SettingsScreen>

const Stack = createStackNavigator()

export const Basic: SignUpStory = () => (
  <TiFQueryClientProvider>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ ...BASE_HEADER_SCREEN_OPTIONS }}>
          <Stack.Screen name="test" component={TestScreen} />
          <Stack.Screen
            name="signUp"
            options={{ headerLeft: () => <XMarkBackButton />, title: "" }}
            component={CredentialsScreen}
          />
          <Stack.Screen
            name="changeHandle"
            options={{ headerLeft: () => <ChevronBackButton />, title: "" }}
            component={HandleScreen}
          />
          <Stack.Screen
            name="verifyCode"
            options={{ headerLeft: () => <ChevronBackButton />, title: "" }}
            component={SignUpVerifyCodeView}
          />
          <Stack.Screen
            name="welcome"
            options={{ headerLeft: () => <ChevronBackButton />, title: "" }}
            component={SignUpEndingView}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  </TiFQueryClientProvider>
)

const CredentialsScreen = () => (
  <SignUpCredentialsFormView
    onPrivacyPolicyTapped={() => console.log("privacy policy tapped")}
    onTermsAndConditionsTapped={() => {
      console.log("terms and conditions tapped")
    }}
  />
)

const HandleScreen = () => {
  const methods = useSignUpChangeUserHandle(
    UserHandle.parse("elonmusk").handle!,
    200,
    {
      changeUserHandle: async () => {
        await sleep(3000)
        throw new Error("Lmao")
      },
      checkIfUserHandleTaken: async () => {
        return await delayData(false, 3000)
      },
      onSuccess: () => console.log("Succeeded")
    }
  )
  return (
    <SignUpChangeUserHandleFormView
      {...methods}
      onHandleTextChanged={methods.handleTextChanged}
    />
  )
}

const TestScreen = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Button
        title="Create Account Form"
        onPress={() => navigation.navigate("signUp")}
      />
      <Button
        title="Change Handle Form"
        onPress={() => navigation.navigate("changeHandle")}
      />
      <Button
        title="Verify Code Form"
        onPress={() => navigation.navigate("verifyCode")}
      />
      <Button title="Welcome" onPress={() => navigation.navigate("welcome")} />
    </View>
  )
}
