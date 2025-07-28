import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { createServer } from '~/src/createServer.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import { addUser, getRoles } from '~/src/lib/manage.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/manage.js')
jest.mock('~/src/lib/error-helper.js')

const roleList = [
  { name: 'Admin', code: 'admin', description: 'admin desc' },
  {
    name: 'Form creator',
    code: 'form-creator',
    description: 'form creator desc'
  }
]

describe('Create user routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.mocked(getRoles).mockResolvedValue(roleList)
    jest.mocked(addUser).mockResolvedValue({ emailAddress: '', userRole: '' })
  })

  describe('GET /manage/users/create', () => {
    test('should render view', async () => {
      const options = {
        method: 'get',
        url: '/manage/users/create',
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
  })

  describe('POST /manage/users/create', () => {
    test('should add user and redirect if valid payload', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/create',
        auth,
        payload: { emailAddress: 'me@here.com', userRole: 'admin' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users')
      expect(addUser).toHaveBeenCalledWith(expect.anything(), {
        userId: 'me@here.com',
        roles: ['admin']
      })
    })

    test('should error if required fields not entered', async () => {
      const options = {
        method: 'post',
        url: '/manage/users/create',
        auth,
        payload: { emailAddress: '' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/create')
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
        url: '/manage/users/create',
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
        url: '/manage/users/create',
        auth,
        payload: { emailAddress: 'me@here.com', userRole: 'admin' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/manage/users/create')
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError('An error occurred', [], undefined),
        'manageUsersValidationFailure'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
