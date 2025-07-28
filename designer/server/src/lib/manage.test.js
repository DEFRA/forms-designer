import config from '~/src/config.js'
import { createMockResponse } from '~/src/lib/__stubs__/editor.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { addUser, getRoles } from '~/src/lib/manage.js'

jest.mock('~/src/lib/fetch.js')

const usersEndpoint = new URL('/users/', config.entitlementUrl)
const token = 'someToken'

const rolesList = [
  { name: 'Admin', code: 'admin', description: 'admin desc' },
  {
    name: 'Form creator',
    code: 'form-creator',
    description: 'form creator desc'
  }
]

describe('manage.js', () => {
  describe('getRoles', () => {
    it('should get the list of roles', async () => {
      jest.mocked(getJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {
          roles: rolesList
        }
      })
      const result = await getRoles(token)
      expect(result).toEqual(rolesList)
    })
  })

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
