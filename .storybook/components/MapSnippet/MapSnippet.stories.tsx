import { ExpandableMapSnippetView } from "@components/MapSnippetView"
import { Headline } from "@components/Text"
import { TiFFormScrollView } from "@components/form-components/ScrollView"
import { XEROX_ALTO_DEFAULT_REGION } from "@explore-events-boundary"
import React from "react"
import { View, Text } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { StoryMeta } from "storybook/HelperTypes"
import { PortalProvider } from "@gorhom/portal"

export const MapSnippetMeta: StoryMeta = {
  title: "MapSnippet"
}

export default MapSnippetMeta

export const Basic = () => (
  <SafeAreaProvider>
    <PortalProvider>
      <SafeAreaView>
        <TiFFormScrollView>
          <View style={{ height: 64 }} />
          <Headline>Hello World</Headline>
          <ExpandableMapSnippetView region={XEROX_ALTO_DEFAULT_REGION} />
          <Headline>Hello World</Headline>
        </TiFFormScrollView>
      </SafeAreaView>
    </PortalProvider>
  </SafeAreaProvider>
)
