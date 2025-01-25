import { StyleProp, ViewStyle, View } from "react-native"
import React from "react"
import { TiFContext, TiFContextValues } from "./Context"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RootSiblingParent } from "react-native-root-siblings"
import { TiFQueryClientProvider } from "@lib/ReactQuery"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { TiFBottomSheetProvider } from "@components/BottomSheet"
import { RootNavigation } from "./navigation/Root"
import { PortalProvider } from "@gorhom/portal"

export type TiFProps = {
  isFontsLoaded: boolean
  style?: StyleProp<ViewStyle>
} & TiFContextValues

/**
 * The root view of the app.
 */
export const TiFView = ({ isFontsLoaded, style, ...props }: TiFProps) => {
  if (!isFontsLoaded) return null
  return (
    <GestureHandlerRootView>
      <PortalProvider>
        <TiFQueryClientProvider>
          <SafeAreaProvider>
            <RootSiblingParent>
              <TiFBottomSheetProvider>
                <View style={style}>
                  <TiFContext.Provider value={props}>
                    <RootNavigation />
                  </TiFContext.Provider>
                </View>
              </TiFBottomSheetProvider>
            </RootSiblingParent>
          </SafeAreaProvider>
        </TiFQueryClientProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  )
}
