import { testFormDefinitionWithMultipleV2ConditionsListRef } from '~/src/__stubs__/form-definition.js'
import { setQuestionSessionState } from '~/src/lib/session-helper.js'
import { handleListConflict } from '~/src/routes/forms/editor-v2/question-details-helper-ext.js'

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

const mockState = {}

describe('Editor v2 question details helper ext routes', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  describe('handleListConflict', () => {
    test('should construct list of conflicts', () => {
      const definition = testFormDefinitionWithMultipleV2ConditionsListRef
      const listElements = /** @type {Item[]} */ ([])
      const res = handleListConflict(
        definition,
        '2c3122b6-bf57-42c9-ab1b-6f67e8575703',
        '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        listElements,
        mockYar,
        mockState,
        'stateId'
      )
      expect(res).toBe(true)
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        'stateId',
        {
          listConflicts: [
            {
              conditionNames: ['isFaveColourRedV2'],
              conflictItem: {
                id: 'e1d4f56e-ad92-49ea-89a8-cf0edb0480f7',
                text: 'Red'
              },
              linkableItems: [
                {
                  hint: undefined,
                  id: '689d3f66-88f7-4dc0-b199-841b72393c19',
                  text: 'Blue',
                  value: 'blue'
                },
                {
                  hint: undefined,
                  id: '93d8b63b-4eef-4c3e-84a7-5b7edb7f9171',
                  text: 'Green',
                  value: 'green'
                }
              ]
            }
          ],
          listItems: []
        }
      )
    })

    test('should return no conflicts', () => {
      const definition = testFormDefinitionWithMultipleV2ConditionsListRef
      const listElements = /** @type {Item[]} */ ([
        {
          id: 'e1d4f56e-ad92-49ea-89a8-cf0edb0480f7',
          text: 'Red',
          value: 'red'
        },
        {
          id: '689d3f66-88f7-4dc0-b199-841b72393c19',
          text: 'Blue',
          value: 'blue'
        },
        {
          id: '93d8b63b-4eef-4c3e-84a7-5b7edb7f9171',
          text: 'Green',
          value: 'green'
        }
      ])
      const res = handleListConflict(
        definition,
        '2c3122b6-bf57-42c9-ab1b-6f67e8575703',
        '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
        listElements,
        mockYar,
        mockState,
        'stateId'
      )
      expect(res).toBe(false)
      expect(setQuestionSessionState).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { Item } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
