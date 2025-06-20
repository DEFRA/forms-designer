import {
  FormDefinitionError,
  FormDefinitionErrorType
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import {
  addErrorsToSession,
  getValidationErrorsFromSession,
  isInvalidFormError,
  isInvalidFormErrorType
} from '~/src/lib/error-helper.js'

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
    test('should add errors', () => {
      const sessionKey = /** @type {ValidationSessionKey} */ ('this-key')
      const error = new Joi.ValidationError(
        'dummy error',
        [
          {
            message: 'error number 1',
            path: ['field-name'],
            type: 'custom',
            context: {
              key: 'field-key',
              label: 'field-key'
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

    test('should handle no errors', () => {
      const sessionKey = /** @type {ValidationSessionKey} */ ('this-key')
      const error = undefined
      const payload = { field1: 'abc' }
      addErrorsToSession(buildMockRequest(payload), error, sessionKey)
      expect(mockFlash).not.toHaveBeenCalled()
    })

    test('should handle invalid error object', () => {
      const sessionKey = /** @type {ValidationSessionKey} */ ('this-key')
      const error = /** @type {Joi.ValidationError} */ ({})
      const payload = { field1: 'abc' }
      addErrorsToSession(buildMockRequest(payload), error, sessionKey)
      expect(mockFlash).not.toHaveBeenCalled()
    })
  })

  describe('getValidationErrorsFromSession', () => {
    test('should get errors', () => {
      const sessionKey = /** @type {ValidationSessionKey} */ ('this-key')
      const payload = { field1: 'abc' }
      getValidationErrorsFromSession(buildMockRequest(payload).yar, sessionKey)
      expect(mockFlash).toHaveBeenCalledWith('this-key')
    })
  })

  describe('isInvalidFormError', () => {
    test('should return true for InvalidFormDefinitionError', () => {
      const boomErr = Boom.boomify(new Error(), {
        data: { error: 'InvalidFormDefinitionError' }
      })
      expect(isInvalidFormError(boomErr)).toBe(true)
    })

    test('should return false for other Boom errors', () => {
      expect(isInvalidFormError(Boom.notFound())).toBe(false)
    })
  })

  describe('isInvalidFormErrorType', () => {
    test('should return true for InvalidFormDefinitionError of type UniqueConditionDisplayName', () => {
      const cause = [
        {
          id: FormDefinitionError.UniqueConditionDisplayName,
          detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
          message: '"conditions[1]" contains a duplicate value',
          type: FormDefinitionErrorType.Unique
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"conditions[1]" contains a duplicate value', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      expect(
        isInvalidFormErrorType(
          boomErr,
          FormDefinitionError.UniqueConditionDisplayName
        )
      ).toBe(true)
    })

    test('should return false for other type of FormDefinitionError', () => {
      const cause = [
        {
          id: FormDefinitionError.UniqueListId,
          detail: { path: ['lists', 1], pos: 1, dupePos: 0 },
          message: '"lists[1]" contains a duplicate value',
          type: FormDefinitionErrorType.Unique
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"lists[1]" contains a duplicate value', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      expect(
        isInvalidFormErrorType(
          boomErr,
          FormDefinitionError.UniqueConditionDisplayName
        )
      ).toBe(false)
    })

    test('should return false for other Boom errors', () => {
      expect(isInvalidFormError(Boom.notFound())).toBe(false)
    })
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 * @import { Yar, ValidationSessionKey } from '@hapi/yar'
 */
