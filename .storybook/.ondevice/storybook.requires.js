/* do not change this file, it is auto generated by storybook. */

import {
  addArgsEnhancer,
  addDecorator,
  addParameters,
  clearDecorators,
  configure
} from "@storybook/react-native"

import "@storybook/addon-ondevice-actions/register"
import "@storybook/addon-ondevice-backgrounds/register"
import "@storybook/addon-ondevice-controls/register"
import "@storybook/addon-ondevice-notes/register"

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs"

import { decorators, parameters } from "./preview"

global.STORIES = [
  {
    titlePrefix: "",
    directory: "./components",
    files: "**/*.stories.?(ts|tsx|js|jsx)",
    importPathMatcher:
      "^\\.[\\\\/](?:components(?:[\\\\/](?!\\.)(?:(?:(?!(?:^|[\\\\/])\\.).)*?)[\\\\/]|[\\\\/]|$)(?!\\.)(?=.)[^\\\\/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$"
  }
]

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require("react-native").LogBox.ignoreLogs([
      "`clearDecorators` is deprecated and will be removed in Storybook 7.0"
    ])
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators()
  decorators.forEach((decorator) => addDecorator(decorator))
}

if (parameters) {
  addParameters(parameters)
}

try {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer))
} catch {}

const getStories = () => {
  return {
    "./components/AttendeesList/AttendeesList.stories.tsx": require("../components/AttendeesList/AttendeesList.stories.tsx"),
    "./components/ContentReporting/ContentReporting.stories.tsx": require("../components/ContentReporting/ContentReporting.stories.tsx"),
    "./components/ContentText/ContextText.stories.tsx": require("../components/ContentText/ContextText.stories.tsx"),
    "./components/Explore/Explore.stories.tsx": require("../components/Explore/Explore.stories.tsx"),
    "./components/LocationSearch/LocationSearch.stories.tsx": require("../components/LocationSearch/LocationSearch.stories.tsx"),
    "./components/SearchBar/SearchBar.stories.tsx": require("../components/SearchBar/SearchBar.stories.tsx"),
    "./components/SettingsScreen/SettingsScreen.stories.tsx": require("../components/SettingsScreen/SettingsScreen.stories.tsx"),
    "./components/SignIn/SignIn.stories.tsx": require("../components/SignIn/SignIn.stories.tsx"),
    "./components/SignUp/SignUp.stories.tsx": require("../components/SignUp/SignUp.stories.tsx"),
    "./components/TextField/TextField.stories.tsx": require("../components/TextField/TextField.stories.tsx"),
    "./components/VerificationCode/VerifyCode.stories.tsx": require("../components/VerificationCode/VerifyCode.stories.tsx")
  }
}

configure(getStories, module, false)
