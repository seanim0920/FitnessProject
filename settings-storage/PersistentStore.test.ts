import { resetTestSQLiteBeforeEach, testSQLite } from "@test-helpers/SQLite"
import { waitFor } from "@testing-library/react-native"
import {
  DEFAULT_LOCAL_SETTINGS,
  SQLiteLocalSettingsStorage,
  localSettingsStore
} from "./LocalSettings"
import { verifyNeverOccurs } from "@test-helpers/ExpectNeverOccurs"
import { PersistentSettingsStores } from "./PersistentStores"

describe("PersistentSettingsStore tests", () => {
  const storage = new SQLiteLocalSettingsStorage(testSQLite)
  let store = PersistentSettingsStores.local(storage)
  resetTestSQLiteBeforeEach()
  beforeEach(() => (store = PersistentSettingsStores.local(storage)))

  it("should emit the default settings when no previously saved settings", async () => {
    const callback = await expectInitialSubscriptionEmitsDefaultSettings()
    expect(callback).toHaveBeenCalledTimes(1)
    expect(store.mostRecentlyPublished).toEqual(DEFAULT_LOCAL_SETTINGS)
  })

  it("should emit updates to settings", async () => {
    const callback = await expectInitialSubscriptionEmitsDefaultSettings()
    store.update({ isHapticFeedbackEnabled: false })
    let expectedSettings = {
      ...DEFAULT_LOCAL_SETTINGS,
      isHapticFeedbackEnabled: false
    }
    expect(callback).toHaveBeenNthCalledWith(2, expectedSettings)
    expect(callback).toHaveBeenCalledTimes(2)
    expect(store.mostRecentlyPublished).toEqual(expectedSettings)

    const newDate = new Date()
    store.update({
      isHapticAudioEnabled: false,
      lastEventArrivalsRefreshDate: newDate
    })
    expectedSettings = {
      ...DEFAULT_LOCAL_SETTINGS,
      isHapticFeedbackEnabled: false,
      isHapticAudioEnabled: false,
      lastEventArrivalsRefreshDate: newDate
    }
    expect(callback).toHaveBeenNthCalledWith(3, expectedSettings)
    expect(callback).toHaveBeenCalledTimes(3)
    expect(store.mostRecentlyPublished).toEqual(expectedSettings)
  })

  it("should persist saved settings", async () => {
    store.update({ isHapticAudioEnabled: false })
    await waitFor(async () => {
      expect(await storage.load()).toEqual({
        ...DEFAULT_LOCAL_SETTINGS,
        isHapticAudioEnabled: false
      })
    })
  })

  it("should not publish identical changes", async () => {
    const callback = await expectInitialSubscriptionEmitsDefaultSettings()
    store.update(DEFAULT_LOCAL_SETTINGS)
    expect(callback).not.toHaveBeenCalledTimes(2)
    expect(store.mostRecentlyPublished).toEqual(DEFAULT_LOCAL_SETTINGS)
  })

  it("should not receive updates after unsubscribing", async () => {
    const callback = jest.fn()
    const unsub = store.subscribe(callback)
    unsub()
    store.update({ isHapticFeedbackEnabled: false })
    await verifyNeverOccurs(() => {
      expect(callback).toHaveBeenCalled()
    })
    expect(store.mostRecentlyPublished).toEqual({
      ...DEFAULT_LOCAL_SETTINGS,
      isHapticFeedbackEnabled: true
    })
  })

  it("should carry saved data over to a new instance", async () => {
    store.update({ isHapticFeedbackEnabled: false })
    const store2 = localSettingsStore(storage)
    const callback = jest.fn()
    store2.subscribe(callback)
    const expectedSettings = {
      ...DEFAULT_LOCAL_SETTINGS,
      isHapticFeedbackEnabled: false
    }
    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(expectedSettings)
    })
    expect(store2.mostRecentlyPublished).toEqual(expectedSettings)
  })

  it("should use the current value when an undefined property is saved", async () => {
    const callback = await expectInitialSubscriptionEmitsDefaultSettings()
    store.update({
      isHapticAudioEnabled: undefined,
      isHapticFeedbackEnabled: false
    })
    expect(callback).toHaveBeenNthCalledWith(2, {
      ...DEFAULT_LOCAL_SETTINGS,
      isHapticAudioEnabled: true,
      isHapticFeedbackEnabled: false
    })
  })

  it("should do the initial emission immediately when new subscription after initial subscription", async () => {
    await expectInitialSubscriptionEmitsDefaultSettings()
    const callback = jest.fn()
    store.subscribe(callback)
    expect(callback).toHaveBeenCalledWith(DEFAULT_LOCAL_SETTINGS)
  })

  it("should return the default settings when the initial load fails", async () => {
    await storage.save({
      isHapticAudioEnabled: false,
      lastEventArrivalsRefreshDate: new Date(0)
    })
    jest.spyOn(storage, "load").mockRejectedValueOnce(new Error())
    await expectInitialSubscriptionEmitsDefaultSettings()
  })

  it("should still publish new settings without error even when underlying storage fails to save", async () => {
    jest.spyOn(storage, "save").mockRejectedValueOnce(new Error())
    const callback = await expectInitialSubscriptionEmitsDefaultSettings()
    store.update({ isHapticFeedbackEnabled: false })
    expect(callback).toHaveBeenCalledWith({
      ...DEFAULT_LOCAL_SETTINGS,
      isHapticFeedbackEnabled: false
    })
  })

  const expectInitialSubscriptionEmitsDefaultSettings = async () => {
    const callback = jest.fn()
    store.subscribe(callback)
    await waitForDefaultSettingsEmission(callback)
    return callback
  }

  const waitForDefaultSettingsEmission = async (callback: jest.Mock) => {
    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(DEFAULT_LOCAL_SETTINGS)
    })
  }
})
