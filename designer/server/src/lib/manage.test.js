import config from '~/src/config.js'
import { createMockResponse } from '~/src/lib/__stubs__/editor.js'
import { getJson } from '~/src/lib/fetch.js'
import { getUsers } from '~/src/lib/manage.js'

jest.mock('~/src/lib/fetch.js')

const userList = [
  {
    userId: 'id1',
    fullName: 'John Smith',
    emailAddress: 'john.smith@here.com',
    roles: ['admin'],
    scopes: []
  },
  {
    userId: 'id2',
    fullName: 'Peter Jones',
    emailAddress: 'peter.jones@email.com',
    roles: ['form-creator'],
    scopes: []
  }
]

const usersEndpoint = new URL('/users/', config.entitlementUrl)
const token = 'someToken'

describe('manage.js', () => {
  describe('getUsers', () => {
    it('should get the list of users', async () => {
      jest.mocked(getJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {
          entities: userList
        }
      })
      const users = await getUsers(token)
      expect(users).toEqual(userList)

      expect(getJson).toHaveBeenCalledWith(usersEndpoint, expect.anything())
    })
  })
})
