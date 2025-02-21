import { PersistentSettingsStores } from "@settings-storage/PersistentStores"
import { resetTestSQLiteBeforeEach, testSQLite } from "@test-helpers/SQLite"
import { SQLiteUserSettingsStorage } from "@settings-storage/UserSettings"
import { mockPlacemark } from "@location/MockData"
import { renderUseHydrateEditEvent } from "./TestHelpers"
import { defaultEditFormValues } from "@event/EditFormValues"
import { fakeTimers } from "@test-helpers/Timers"

describe("EditEvent tests", () => {
  describe("UseHydrateEditEvent tests", () => {
    resetTestSQLiteBeforeEach()
    const settings = PersistentSettingsStores.user(
      new SQLiteUserSettingsStorage(testSQLite)
    )
    fakeTimers()
    beforeEach(() => jest.setSystemTime(new Date(20_000)))

    it("should hydrate with presets and default values when no initial values provided", async () => {
      const placemark = mockPlacemark()
      settings.update({
        eventPresetShouldHideAfterStartDate: true,
        eventPresetLocation: { type: "placemark", value: placemark }
      })
      const { result } = renderUseHydrateEditEvent(undefined, settings)
      expect(result.current).toEqual({
        ...defaultEditFormValues(),
        shouldHideAfterStartDate: true,
        location: { placemark, coordinate: undefined }
      })
    })

    it("should hydrate with initial values when provided", async () => {
      const values = {
        ...defaultEditFormValues(),
        name: "Test Event",
        description: "We are a test event!"
      }
      const placemark = mockPlacemark()
      settings.update({
        eventPresetShouldHideAfterStartDate: true,
        eventPresetLocation: { type: "placemark", value: placemark }
      })
      const { result } = renderUseHydrateEditEvent(values, settings)
      expect(result.current).toEqual(values)
    })

    it("should be able to hydrate twice in a row", async () => {
      const values = {
        ...defaultEditFormValues(),
        name: "Test Event",
        description: "We are a test event!"
      }
      const { result: result1 } = renderUseHydrateEditEvent(values, settings)
      const newValues = { ...values, shouldHideAfterStartDate: true }
      const { result: result2 } = renderUseHydrateEditEvent(newValues, settings)
      expect(result1.current).toEqual(result2.current)
      expect(result1.current).toEqual(newValues)
    })
  })
})
