import { TiFSQLite } from "@lib/SQLite"

/**
 * An in memory {@link TiFSQLite} instance for testing.
 */
export const testSQLite = new TiFSQLite(":memory:")

/**
 * Resets the data inside {@link testSQLite}.
 */
export const resetTestSQLiteBeforeEach = () => {
  beforeEach(async () => {
    await testSQLite.withTransaction(async (db) => {
      await db.run`DELETE FROM LocationArrivals`
      await db.run`DELETE FROM LocationPlacemarks`
    })
  })
}
