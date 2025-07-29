import config from '~/src/config.js'
import { createMockResponse } from '~/src/lib/__stubs__/editor.js'
import { getJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  addUser,
  getRoles,
  getUser,
  getUsers,
  updateUser
} from '~/src/lib/manage.js'

jest.mock('~/src/lib/fetch.js')

const usersEndpoint = new URL('/users/', config.entitlementUrl)
const token = 'someToken'
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

const rolesList = [
  { name: 'Admin', code: 'admin', description: 'admin desc' },
  {
    name: 'Form creator',
    code: 'form-creator',
    description: 'form creator desc'
  }
]

describe('manage.js', () => {
  describe('getUser', () => {
    it('should get the user details', async () => {
      const userObj = {
        userId: '12345',
        roles: ['admin'],
        scopes: ['user-edit', 'form-delete']
      }
      jest.mocked(getJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {
          entity: userObj
        }
      })
      const result = await getUser(token, userObj.userId)
      expect(result).toEqual(userObj)
    })
  })

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
      const payload = { email: 'my-email', roles: ['role1'] }
      const result = await addUser(token, payload)
      expect(result).toEqual({})

      expect(postJson).toHaveBeenCalledWith(usersEndpoint, {
        payload,
        headers: { Authorization: `Bearer ${token}` }
      })
    })
  })

  describe('updateUser', () => {
    it('should update the user', async () => {
      jest.mocked(putJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      const payload = { userId: 'my-id', roles: ['role1'] }
      const result = await updateUser(token, payload)
      expect(result).toEqual({})

      expect(putJson).toHaveBeenCalledWith(usersEndpoint, {
        payload: {
          roles: ['role1']
        },
        headers: { Authorization: `Bearer ${token}` }
      })
    })
  })

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
