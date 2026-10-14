import { sortByName } from '~/src/models/manage/users.js'

const testUsers = /** @type {EntitlementUser[]} */ ([
  { displayName: 'John Smith' },
  { displayName: 'Joe Bloggs' },
  { displayName: 'James' },
  { displayName: 'Peter' },
  { displayName: 'Aaron St James' }
])

describe('Users model', () => {
  describe('sortByName', () => {
    test('should sort by name', () => {
      const res = testUsers.sort(sortByName)
      expect(res).toHaveLength(5)
      expect(res[0].displayName).toBe('Joe Bloggs')
      expect(res[1].displayName).toBe('John Smith')
      expect(res[2].displayName).toBe('Aaron St James')
      expect(res[3].displayName).toBe('James')
      expect(res[4].displayName).toBe('Peter')
    })
  })
})

/**
 * @import { EntitlementUser } from '@defra/forms-model'
 */
