import { Scopes } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import { allRoles } from '~/src/lib/__stubs__/roles.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import {
  addUser,
  deleteUser,
  getRoles,
  getUser,
  updateUser
} from '~/src/lib/manage.js'
import { Roles } from '~/src/models/account/role-mapper.js'
import {
  artifacts,
  auth,
  credentials,
  profile,
  user
} from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/manage.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/config.ts')

describe('Create and edit user routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.mocked(getRoles).mockResolvedValue(allRoles)
    jest
      .mocked(addUser)
      .mockResolvedValue({ emailAddress: '', userRole: '', displayName: '' })
    jest.mocked(getUser).mockResolvedValue(/** @type {EntitlementUser} */ ({}))
    jest.mocked(config).featureFlagUseEntitlementApi = true
  })

  describe('GET /manage/users', () => {
    test('should render view when creating', async () => {
      const options = {
        method: 'get',
        url: '/manage/users/new',
        auth
      }

      const { container, response } = await renderResponse(server, options)

      const $mastheadHeading = container.getByText('Add new user')
      const $radios = container.getAllByRole('radio')
      const $buttons = container.getAllByRole('button', { name: 'Add user' })

      expect($mastheadHeading).toBeDefined()
      expect($radios).toHaveLength(2)
      expect($radios[0].outerHTML).toContain('value="admin"')
      expect($radios[1].outerHTML).toContain('value="form-creator"')
      expect($buttons).toHaveLength(1)
      expect(response.result).toMatchSnapshot()
    })

    test('should render view when editing', async () => {
      jest.mocked(getUser).mockResolvedValue(
        /** @type {EntitlementUser} */ ({
          userId: '12345',
          roles: ['admin']
        })
      )
      const options = {
        method: 'get',
        url: '/manage/users/12345/amend',
        auth
      }

      const { container, response } = await renderResponse(server, options)

      const $mastheadHeading = container.getByText('Manage user account')
      const $radios = container.getAllByRole('radio')
      const $buttonSave = container.getAllByRole('button', {
        name: 'Save changes'
      })
      const $buttonRemove = container.getAllByRole('button', {
        name: 'Remove user'
      })

      expect($mastheadHeading).toBeDefined()
      expect($radios).toHaveLength(2)
      expect($radios[0].outerHTML).toContain('value="admin"')
      expect($radios[1].outerHTML).toContain('value="form-creator"')
      expect($buttonSave).toHaveLength(1)
      expect($buttonRemove).toHaveLength(1)
      expect(response.result).toMatchSnapshot()
    })

    test('should render view when deleting', async () => {
      jest.mocked(getUser).mockResolvedValue(
        /** @type {EntitlementUser} */ ({
          userId: '12345',
          roles: ['admin']
        })
      )
      const options = {
        method: 'get',
        url: '/manage/users/12345/delete',
        auth
      }

      const { container, response } = await renderResponse(server, options)

      const $mastheadHeading = container.getByText(
        'Are you sure you want to remove this user?'
      )
      const $buttonSave = container.getAllByRole('button', {
        name: 'Remove user'
      })
      const $buttonCancel = container.getAllByRole('button', {
        name: 'Cancel'
      })

      expect($mastheadHeading).toBeDefined()
      expect($buttonSave).toHaveLength(1)
      expect($buttonCancel).toHaveLength(1)
      expect(response.result).toMatchSnapshot()
    })
  })

  describe('POST /manage/users/new', () => {
    test('should add user and redirect if valid payload', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/new',
        auth,
        payload: { emailAddress: 'me@here.com', userRole: 'admin' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users')
      expect(addUser).toHaveBeenCalledWith(expect.anything(), {
        email: 'me@here.com',
        roles: ['admin']
      })
    })

    test('should error if required fields not entered', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/new',
        auth,
        payload: { emailAddress: '' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/new')
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError(
          'Enter an email address in the correct format. Select a role',
          [],
          undefined
        ),
        'manageUsersValidationFailure'
      )
    })

    test('should error if API failure (non-Boom)', async () => {
      jest.mocked(addUser).mockImplementationOnce(() => {
        throw new Error('api error')
      })
      const options = {
        method: 'post',
        url: '/manage/users/new',
        auth,
        payload: { emailAddress: 'me@here.com', userRole: 'admin' }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    })

    test('should error if API failure (handle Boom error)', async () => {
      jest.mocked(addUser).mockImplementationOnce(() => {
        throw Boom.boomify(new Error('api boom error'))
      })
      const options = {
        method: 'post',
        url: '/manage/users/new',
        auth,
        payload: { emailAddress: 'me@here.com', userRole: 'admin' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/new')
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError('An error occurred', [], undefined),
        'manageUsersValidationFailure'
      )
    })
  })

  describe('POST /manage/users/12345/amend', () => {
    test('should amend user and redirect if valid payload', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/12345/amend',
        auth,
        payload: { userRole: 'admin' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users')
      expect(updateUser).toHaveBeenCalledWith(expect.anything(), {
        userId: '12345',
        roles: ['admin']
      })
    })

    test('should error if required fields not entered', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/12345/amend',
        auth,
        payload: { userRole: '' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/12345/amend')
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError('Select a role', [], undefined),
        'manageUsersValidationFailure'
      )
    })

    test('should error if API failure (non-Boom)', async () => {
      jest.mocked(updateUser).mockImplementationOnce(() => {
        throw new Error('api error')
      })
      const options = {
        method: 'post',
        url: '/manage/users/12345/amend',
        auth,
        payload: { userRole: 'admin' }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    })

    test('should error if API failure (handle Boom error)', async () => {
      jest.mocked(updateUser).mockImplementationOnce(() => {
        throw Boom.boomify(new Error('api boom error'))
      })
      const options = {
        method: 'post',
        url: '/manage/users/12345/amend',
        auth,
        payload: { userRole: 'admin' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/12345/amend')
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError('An error occurred', [], undefined),
        'manageUsersValidationFailure'
      )
    })

    test('should update user and redirect if valid payload', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/12345/amend',
        auth,
        payload: {
          userRole: 'admin'
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users')
      expect(updateUser).toHaveBeenCalledWith(expect.anything(), {
        userId: '12345',
        roles: ['admin']
      })
    })
  })

  describe('POST /manage/users/12345/delete', () => {
    test('should delete user and redirect if valid payload', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/12345/delete',
        auth
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users')
      expect(deleteUser).toHaveBeenCalledWith(expect.anything(), '12345')
    })

    test('should error if API failure (non-Boom)', async () => {
      jest.mocked(deleteUser).mockImplementationOnce(() => {
        throw new Error('api error')
      })
      const options = {
        method: 'post',
        url: '/manage/users/12345/delete',
        auth
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    })

    test('should error if API failure (handle Boom error)', async () => {
      jest.mocked(deleteUser).mockImplementationOnce(() => {
        throw Boom.boomify(new Error('api boom error'))
      })
      const options = {
        method: 'post',
        url: '/manage/users/12345/delete',
        auth
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/12345/delete')
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError('An error occurred', [], undefined),
        'manageUsersValidationFailure'
      )
    })
  })

  describe('checkUserManagementAccess pre-handler', () => {
    test('should return 403 when feature flag is disabled', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = false

      const options = {
        method: 'get',
        url: '/manage/users/new',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
      expect(response.result).toContain(
        'You do not have access to this service'
      )
    })

    test('should return 403 when user does not have admin role', async () => {
      const claims = {
        token: profile({ groups: ['valid-test-group'], login_hint: 'foo' }),
        idToken: profile()
      }

      const nonAdminAuth = {
        strategy: 'azure-oidc',
        artifacts: artifacts(claims),
        credentials: credentials({
          claims,
          user: user(claims.token, [Roles.FormCreator]),
          scope: [Scopes.FormRead, Scopes.FormEdit]
        })
      }

      const options = {
        method: 'get',
        url: '/manage/users/new',
        auth: nonAdminAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
      expect(response.result).toContain(
        'You do not have access to this service'
      )
    })
  })
})

/**
 * @import { EntitlementUser } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
