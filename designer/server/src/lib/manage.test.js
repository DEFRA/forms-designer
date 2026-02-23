import { Roles, Scopes } from '@defra/forms-model'

import config from '~/src/config.js'
import { createMockResponse } from '~/src/lib/__stubs__/editor.js'
import { delJson, getJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  addUser,
  deleteUser,
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
    roles: [Roles.Admin],
    scopes: []
  },
  {
    userId: 'id2',
    fullName: 'Peter Jones',
    emailAddress: 'peter.jones@email.com',
    roles: [Roles.FormCreator],
    scopes: []
  }
]

describe('manage.js', () => {
  describe('getUser', () => {
    it('should get the user details', async () => {
      const userObj = {
        userId: '12345',
        roles: [Roles.Admin],
        scopes: [Scopes.UserEdit, Scopes.FormDelete]
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

  describe('addUser', () => {
    it('should add the user', async () => {
      jest.mocked(postJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      const payload = { email: 'my-email', roles: [Roles.Admin] }
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
      const payload = { userId: 'my-id', roles: [Roles.Admin] }
      const result = await updateUser(token, payload)
      expect(result).toEqual({})

      expect(putJson).toHaveBeenCalledWith(usersEndpoint, {
        payload: {
          roles: [Roles.Admin]
        },
        headers: { Authorization: `Bearer ${token}` }
      })
    })
  })

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      jest.mocked(delJson).mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      await deleteUser(token, '12345')

      expect(delJson).toHaveBeenCalledWith(usersEndpoint, {
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
