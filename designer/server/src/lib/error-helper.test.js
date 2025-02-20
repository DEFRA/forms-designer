import Joi from 'joi'

import { addErrorsToSession } from '~/src/lib/error-helper.js'

const mockFlash = jest.fn()

/**
 *
 * @param {Request['payload']} payload
 */
const buildMockRequest = (payload) => {
  const yar = /** @type {Yar}} */ ({
    flash: mockFlash,
    id: '',
    reset: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    clear: jest.fn(),
    touch: jest.fn(),
    lazy: jest.fn(),
    commit: jest.fn()
  })

  const res = /** @type {Request} */ ({
    payload,
    yar
  })
  return res
}

describe('Validation functions', () => {
  describe('addErrorsToSession', () => {
    test('should return empty object', () => {
      const sessionKey = /** @type ValidationSessionKey */ ('this-key')
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
 * @import { Yar, ValidationSessionKey } from '@hapi/yar'
 */
