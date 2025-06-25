import { ConditionType, OperatorName } from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'
import Joi from 'joi'

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

    test('should not set error if number is 0', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'A Joi error',
          path: [1, 0],
          type: 'error'
        }
      ])
      const error = new Joi.ValidationError('A Joi error', items, {})
      processErrorMessages(error)
      expect(error.details[0].message).toBe('A Joi error')
    })

    test('should set error if number', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'A Joi error',
          path: [1, 2],
          type: 'error'
        },
        {
          message: 'A Joi error',
          path: [1, 2],
          type: 'error'
        }
      ])
      const error = new Joi.ValidationError('A Joi error', items, {})
      processErrorMessages(error)
      expect(error.details[1].message).toBe(
        'A Joi error for additional condition 2'
      )
    })

    test('should not set error if not a number', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'A Joi error',
          path: ['1', '2'],
          type: 'error'
        }
      ])
      const error = new Joi.ValidationError('A Joi error', items, {})
      processErrorMessages(error)
      expect(error.details[0].message).toBe('A Joi error')
    })

    test('should modify error message if relative date period', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'Enter a condition value',
          path: ['1', '2'],
          type: 'error',
          context: {
            key: 'period'
          }
        }
      ])
      const error = new Joi.ValidationError(
        'Enter a condition value',
        items,
        {}
      )
      processErrorMessages(error)
      expect(error.details[0].message).toBe('Enter a condition value period')
    })

    test('should modify error message if relative date unit', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'Enter a condition value',
          path: ['1', '2'],
          type: 'error',
          context: {
            key: 'unit'
          }
        }
      ])
      const error = new Joi.ValidationError(
        'Enter a condition value',
        items,
        {}
      )
      processErrorMessages(error)
      expect(error.details[0].message).toBe('Enter a condition value unit')
    })

    test('should modify error message if relative date direction', () => {
      const items = /** @type {Joi.ValidationErrorItem[]} */ ([
        {
          message: 'Enter a condition value',
          path: ['1', '2'],
          type: 'error',
          context: {
            key: 'direction'
          }
        }
      ])
      const error = new Joi.ValidationError(
        'Enter a condition value',
        items,
        {}
      )
      processErrorMessages(error)
      expect(error.details[0].message).toBe('Enter a condition value direction')
    })
  })

  describe('buildSessionState', () => {
    test('should ignore if state already exists', () => {
      const state = /** @type {ConditionSessionState} */ ({
        id: 'my-state'
      })
      jest.mocked(getConditionSessionState).mockReturnValue(state)

      const res = buildSessionState(mockYar, '12345', buildDefinition(), 'new')
      expect(res).toEqual(state)
    })

    test('should find condition if exists', () => {
      const componentId = 'farm-type-field'
      const conditionId = 'cattle-farm-condition'
      const pageId = 'farm-details-page'

      const testComponent = buildTextFieldComponent({
        id: componentId,
        name: 'farmType',
        title: 'What type of farming do you do?'
      })

      /** @type {ConditionWrapperV2} */
      const mockConditionV2 = {
        id: conditionId,
        displayName: 'Show if cattle farming',
        items: [
          {
            id: 'cattle-farm-check',
            componentId,
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'cattle'
          }
        ]
      }

      const state = /** @type {ConditionSessionState} */ ({})
      jest.mocked(getConditionSessionState).mockReturnValue(state)

      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: pageId,
            components: [testComponent]
          })
        ],
        conditions: [mockConditionV2]
      })

      const res = buildSessionState(mockYar, '12345', definition, conditionId)
      expect(res).toEqual({
        conditionWrapper: {
          id: 'cattle-farm-condition',
          displayName: 'Show if cattle farming',
          items: [
            {
              id: expect.any(String),
              componentId: 'farm-type-field',
              operator: 'is',
              type: 'StringValue',
              value: 'cattle'
            }
          ]
        },
        id: 'cattle-farm-condition',
        stateId: '12345'
      })
    })
  })
})

/**
 * @import { ConditionSessionState, ConditionWrapperV2 } from '@defra/forms-model'
 * @import { Yar} from '@hapi/yar'
 */
