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
      "^\\.[\\\\/](?:components(?:[\\\\/](?!\\.)(?:(?:(?!(?:^|[\\\\/])\\.).)*?)[\\\\/]|[\\\\/]|$)(?!\\.)(?=.)[^\\\\/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$",
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
    "./componentsAttendeesListAttendeesList.stories.tsx": require("../components/AttendeesList/AttendeesList.stories.tsx"),
    "./componentsButtonButton.stories.tsx": require("../components/Button/Button.stories.tsx"),
    "./componentsContentReportingContentReporting.stories.tsx": require("../components/ContentReporting/ContentReporting.stories.tsx"),
    "./componentsContentTextContextText.stories.tsx": require("../components/ContentText/ContextText.stories.tsx"),
    "./componentsDateTimePickerDateTimePicker.stories.tsx": require("../components/DateTimePicker/DateTimePicker.stories.tsx"),
    "./componentsEventFormEventForm.stories.tsx": require("../components/EventForm/EventForm.stories.tsx"),
    "./componentsEventFormToolbarEventFormToolbar.stories.tsx": require("../components/EventFormToolbar/EventFormToolbar.stories.tsx"),
    "./componentsHexColorPickerHexColorPicker.stories.tsx": require("../components/HexColorPicker/HexColorPicker.stories.tsx"),
    "./componentsIconButtonIconButton.stories.tsx": require("../components/IconButton/IconButton.stories.tsx"),
    "./componentsLocationSearchResultRowLocationSearchResultRow.stories.tsx": require("../components/LocationSearchResultRow/LocationSearchResultRow.stories.tsx"),
    "./componentsSearchBarSearchBar.stories.tsx": require("../components/SearchBar/SearchBar.stories.tsx"),
    "./componentsSettingsScreenSettingsScreen.stories.tsx": require("../components/SettingsScreen/SettingsScreen.stories.tsx"),
  };
};

configure(getStories, module, false);
