import { TiFView } from "@core-root"
import { eventsByRegion } from "@explore-events-boundary"
import { SettingsProvider } from "@settings-storage/Hooks"
import { SQLiteLocalSettingsStorage } from "@settings-storage/LocalSettings"
import { PersistentSettingsStores } from "@settings-storage/PersistentStores"
import { SQLiteUserSettingsStorage } from "@settings-storage/UserSettings"
import { testSQLite } from "@test-helpers/SQLite"
import { AlphaUserSessionProvider, AlphaUserStorage } from "@user/alpha"
import { AlphaUserMocks } from "@user/alpha/MockData"
import React from "react"
import { UserProfileFeature } from "user-profile-boundary/Context"

const TiFPreview = {
  title: "TiF Preview"
}

export default TiFPreview

const storage = AlphaUserStorage.ephemeral(AlphaUserMocks.TheDarkLord)

const localSettings = PersistentSettingsStores.local(
  new SQLiteLocalSettingsStorage(testSQLite)
)
const userSettings = PersistentSettingsStores.user(
  new SQLiteUserSettingsStorage(testSQLite)
)
userSettings.update({
  eventPresetDurations: [3900, 7500, 8400, 12300, 9500, 13700]
})

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
