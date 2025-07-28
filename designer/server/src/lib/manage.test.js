import config from '~/src/config.js'
import { createMockResponse } from '~/src/lib/__stubs__/editor.js'
import { postJson } from '~/src/lib/fetch.js'
import { addUser } from '~/src/lib/manage.js'

jest.mock('~/src/lib/fetch.js')

const usersEndpoint = new URL('/users/', config.entitlementUrl)
const token = 'someToken'

describe('manage.js', () => {
  describe('addUser', () => {
    it('should add the user', async () => {
      jest.mocked(postJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      const payload = { userId: 'my-user-id', roles: ['role1'] }
      const result = await addUser(token, payload)
      expect(result).toEqual({})

      expect(postJson).toHaveBeenCalledWith(usersEndpoint, {
        payload,
        headers: { Authorization: `Bearer ${token}` }
      })
    })
  })
})
