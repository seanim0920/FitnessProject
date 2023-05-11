/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
  clearDecorators,
} from "@storybook/react-native";

global.STORIES = [
  {
    titlePrefix: "",
    directory: "./components",
    files: "**/*.stories.?(ts|tsx|js|jsx)",
    importPathMatcher:
      "^\\.[\\\\/](?:components(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$",
  },
];

import "@storybook/addon-ondevice-notes/register";
import "@storybook/addon-ondevice-controls/register";
import "@storybook/addon-ondevice-backgrounds/register";
import "@storybook/addon-ondevice-actions/register";

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";

import { decorators, parameters } from "./preview";

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require("react-native").LogBox.ignoreLogs([
      "`clearDecorators` is deprecated and will be removed in Storybook 7.0",
    ]);
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators();
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

try {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return {
    "./components/Button/Button.stories.tsx": require("../components/Button/Button.stories.tsx"),
    "./components/ContentReporting/ContentReporting.stories.tsx": require("../components/ContentReporting/ContentReporting.stories.tsx"),
    "./components/DateTimePicker/DateTimePicker.stories.tsx": require("../components/DateTimePicker/DateTimePicker.stories.tsx"),
    "./components/EventForm/EventForm.stories.tsx": require("../components/EventForm/EventForm.stories.tsx"),
    "./components/EventFormToolbar/EventFormToolbar.stories.tsx": require("../components/EventFormToolbar/EventFormToolbar.stories.tsx"),
    "./components/HexColorPicker/HexColorPicker.stories.tsx": require("../components/HexColorPicker/HexColorPicker.stories.tsx"),
    "./components/IconButton/IconButton.stories.tsx": require("../components/IconButton/IconButton.stories.tsx"),
    "./components/LinkedText/LinkedText.stories.tsx": require("../components/LinkedText/LinkedText.stories.tsx"),
    "./components/LocationSearchResultRow/LocationSearchResultRow.stories.tsx": require("../components/LocationSearchResultRow/LocationSearchResultRow.stories.tsx"),
    "./components/SearchBar/SearchBar.stories.tsx": require("../components/SearchBar/SearchBar.stories.tsx"),
  };
};

configure(getStories, module, false);
