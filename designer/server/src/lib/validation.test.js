import Joi from 'joi'

import { addErrorsToSession } from '~/src/lib/validation.js'

const mockFlash = jest.fn()

/**
 *
 * @param {Request} payload
 */
const buildMockRequest = (payload) => ({
  yar: {
    flash: mockFlash,
    id: '',
    reset: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    clear: jest.fn(),
    touch: jest.fn(),
    lazy: jest.fn(),
    commit: jest.fn()
  },
  payload
})

describe('Validation functions', () => {
  describe('addErrorsToSession', () => {
    test('should return empty object', () => {
      const sessionKey = /** type ValidationSessionKey */ 'this-key'
      const error = new Joi.ValidationError(
        'dummy error',
        [
          {
            message: 'error number 1',
            path: ['field-name'],
            type: 'custom',
            context: {
              key: 'field-key'
            }
          }
        ],
        undefined
      )
      const payload = { field1: 'abc' }
      addErrorsToSession(buildMockRequest(payload), error, sessionKey)
      expect(mockFlash).toHaveBeenCalledWith('this-key', {
        formErrors: {
          'field-key': {
            href: '#field-key',
            text: 'error number 1'
          }
        },
        formValues: { field1: 'abc' }
      })
    })
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 */
