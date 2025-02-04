import { TiFView } from "@core-root"
import { EventMocks } from "@event-details-boundary/MockData"
import { clientSideEventFromResponse } from "@event/ClientSideEvent"
import { eventsByRegion } from "@explore-events-boundary"
import { setAutocorrectingInterval } from "@lib/AutocorrectingInterval"
import { randomIntegerInRange } from "@lib/utils/Random"
import { SettingsProvider } from "@settings-storage/Hooks"
import { SQLiteLocalSettingsStorage } from "@settings-storage/LocalSettings"
import { PersistentSettingsStores } from "@settings-storage/PersistentStores"
import { SQLiteUserSettingsStorage } from "@settings-storage/UserSettings"
import { testSQLite } from "@test-helpers/SQLite"
import { AlphaUserSessionProvider, AlphaUserStorage } from "@user/alpha"
import React from "react"
import { Platform } from "react-native"
import { repeatElements } from "TiFShared/lib/Array"
import { UserProfileFeature } from "user-profile-boundary/Context"

const TiFPreview = {
  title: "TiF Preview"
}

export default TiFPreview

const storage = AlphaUserStorage.ephemeral()

const localSettings = PersistentSettingsStores.local(
  new SQLiteLocalSettingsStorage(testSQLite)
)
const userSettings = PersistentSettingsStores.user(
  new SQLiteUserSettingsStorage(testSQLite)
)
userSettings.update({
  eventPresetDurations: [3900, 7500, 8400, 12300, 9500, 13700]
})

const interval = () => {
  let start = new Date()
  setInterval(() => {
    const end = new Date()
    console.log(
      "interval drift",
      Platform.OS,
      end.getTime() - start.getTime() - 1000
    )
    start = end
  }, 1000)
}

interval()

export const Basic = () => (
  <SettingsProvider
    localSettingsStore={localSettings}
    userSettingsStore={userSettings}
  >
    <UserProfileFeature.Provider>
      <AlphaUserSessionProvider storage={storage}>
        <TiFView
          fetchEvents={eventsByRegion}
          isFontsLoaded={true}
          style={{ flex: 1 }}
        />
      </AlphaUserSessionProvider>
    </UserProfileFeature.Provider>
  </SettingsProvider>
)
