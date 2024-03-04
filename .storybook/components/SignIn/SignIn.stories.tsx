import { TiFAPI, createAWSTiFAPIFetch } from "@api-client"
import { createForgotPasswordScreens } from "@auth/forgot-password"
import { createForgotPasswordEnvironment } from "@auth/forgot-password/Environment"
import {
  CognitoSignInAuthenticator,
  SignInParamsList,
  createSignInScreens
} from "@auth/sign-in"
import {
  cognitoConfirmSignUpWithAutoSignIn,
  createSignUpEnvironment
} from "@auth/sign-up"
import { Auth } from "@aws-amplify/auth"
import { BASE_HEADER_SCREEN_OPTIONS } from "@components/Navigation"
import { API_URL } from "@env"
import { TiFQueryClientProvider } from "@lib/ReactQuery"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createSignUpScreens } from "@root-feature/navigation/auth/SignUp"
import { SettingsScreen } from "@screens/SettingsScreen/SettingsScreen"
import { ComponentMeta, ComponentStory } from "@storybook/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

const SignInMeta: ComponentMeta<typeof SettingsScreen> = {
  title: "Sign In"
}

export default SignInMeta

type SignInStory = ComponentStory<typeof SettingsScreen>

const Stack = createStackNavigator<SignInParamsList>()

const tiFAPI = new TiFAPI(createAWSTiFAPIFetch(new URL(API_URL)))

const authenticator = new CognitoSignInAuthenticator()
const signInScreens = createSignInScreens(Stack, authenticator)
const signUpScreens = createSignUpScreens(
  Stack,
  createSignUpEnvironment(
    {
      signUp: async (request) => await Auth.signUp(request),
      resendSignUp: async (username: string) => {
        await Auth.resendSignUp(username)
      },
      confirmSignUpWithAutoSignIn: cognitoConfirmSignUpWithAutoSignIn
    },
    tiFAPI
  )
)
const forgotPasswordScreens = createForgotPasswordScreens(
  Stack,
  createForgotPasswordEnvironment(Auth)
)

export const Basic: SignInStory = () => (
  <TiFQueryClientProvider>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={BASE_HEADER_SCREEN_OPTIONS}
          initialRouteName="signInForm"
        >
          {signInScreens}
          {signUpScreens}
          {forgotPasswordScreens}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  </TiFQueryClientProvider>
)
