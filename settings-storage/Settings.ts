export type SettingsStoreUnsubscribe = () => void

export type SettingValue = string | boolean | number | Date | null

export type AnySettings = Record<string, SettingValue>

/**
 * An interface for observing settings.
 */
export interface SettingsStore<Settings extends AnySettings> {
  /**
   * Returns the most recently published settings from a subscriber.
   */
  get mostRecentlyPublished(): Settings

  /**
   * Subscribes to the store. This method should publish to new subscribers
   * immediately, and load the initial settings for the first subscriber.
   */
  subscribe(callback: (settings: Settings) => void): SettingsStoreUnsubscribe

  /**
   * Updates and publishes the new values of the settings in `partialSettings`.
   */
  update(partialSettings: Partial<Settings>): void
}

/**
 * An interface for storing settings.
 */
export interface SettingsStorage<Settings extends AnySettings> {
  /**
   * A unique identifier of this storage instance used for logging.
   */
  get tag(): string

  /**
   * Loads the current settings from the storage.
   */
  load(): Promise<Settings>

  /**
   * Saves the new values of the settings in `partialSettings`.
   */
  save(partialSettings: Partial<Settings>): Promise<void>
}

/**
 * Returns true if 2 settings objects are equal.
 */
export const areSettingsEqual = <Settings extends AnySettings>(
  s1: Settings,
  s2: Settings
) => {
  return Object.keys(s1).every((key) => {
    const [v1, v2] = [s1[key], s2[key]]
    if (v1 instanceof Date && v2 instanceof Date) {
      return v1.getTime() === v2.getTime()
    }
    return v1 === v2
  })
}
