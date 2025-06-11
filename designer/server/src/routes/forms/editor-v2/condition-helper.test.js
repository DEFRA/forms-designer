import Joi from 'joi'

import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { getConditionSessionState } from '~/src/lib/session-helper.js'
import {
  buildSessionState,
  processErrorMessages
} from '~/src/routes/forms/editor-v2/condition-helper.js'

jest.mock('~/src/lib/session-helper.js')

const mockFlash = jest.fn()
const mockGet = jest.fn()
const mockSet = jest.fn()

const mockYar = /** @type {Yar}} */ ({
  flash: mockFlash,
  id: '',
  reset: jest.fn(),
  set: mockSet,
  get: mockGet,
  clear: jest.fn(),
  touch: jest.fn(),
  lazy: jest.fn(),
  commit: jest.fn()
})

describe('Editor v2 condition helper', () => {
  describe('processErrorMessages', () => {
    test('should ignore if not a Joi error', () => {
      const error = new Error('Not a Joi error')
      const errorCopy = new Error('Not a Joi error')
      processErrorMessages(error)
      expect(error).toEqual(errorCopy)
    })

    test('should set error if number', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'A Joi error',
          path: [1, 2],
          type: 'error'
        }
      ])
      const error = new Joi.ValidationError('A Joi error', items, {})
      processErrorMessages(error)
      expect(error.details[0].message).toBe('A Joi error for condition 3')
    })
  })

  describe('buildSessionState', () => {
    test('should ignore if state already exists', () => {
      const state = /** @type{ConditionSessionState} */ ({
        id: 'my-state'
      })
      jest.mocked(getConditionSessionState).mockReturnValue(state)

      const res = buildSessionState(mockYar, '12345', buildDefinition(), 'new')
      expect(res).toEqual(state)
    })
  })
})

/**
 * @import { ConditionSessionState } from '@defra/forms-model'
 * @import { Yar} from '@hapi/yar'
 */
