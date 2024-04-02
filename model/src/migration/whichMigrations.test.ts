import { whichMigrations } from '~/src/migration/index.js'
import { migrate as V0_TO_V2 } from '~/src/migration/migration.0-2.js'
import { migrate as V1_TO_V2 } from '~/src/migration/migration.1-2.js'

test('whichMigration determines which migration scrips should be applied', () => {
  expect(whichMigrations(0)).toEqual(new Set([V0_TO_V2]))
  expect(whichMigrations(1)).toEqual(new Set([V1_TO_V2]))
})
