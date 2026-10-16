import { testFormDefinitionWithMultipleV2ConditionsListRef } from '~/src/__stubs__/form-definition.js'
import { setQuestionSessionState } from '~/src/lib/session-helper.js'
import { handleListConflict } from '~/src/routes/forms/editor-v2/question-details-helper-ext.js'
import { handleSaveItem } from '~/src/routes/forms/editor-v2/question-details-helper.js'

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

/**
 *
 * @param {Request['payload']} payload
 */
const buildMockRequest = (payload) => {
  const req =
    /** @type {Request<{ Payload: FormEditorInputQuestionDetails }>} */ ({
      payload,
      yar: mockYar
    })

  return {
    mockRequest: req,
    mockGet,
    mockSet,
    mockFlash
  }
}

describe('Editor v2 question details helper ext routes', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  describe('handleListConflict', () => {
    test('should construct list of conflicts', () => {
      const definition = testFormDefinitionWithMultipleV2ConditionsListRef
      const listElements = /** @type {Item[]} */ ([
        { id: 'new1-id', text: 'new1', value: 'new1' },
        { id: 'new2-id', text: 'new2', value: 'new2' }
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
                  id: undefined,
                  text: 'new1',
                  value: 'new1'
                },
                {
                  id: undefined,
                  text: 'new2',
                  value: 'new2'
                }
              ]
            }
          ],
          listItems: [
            {
              id: expect.any(String),
              text: 'new1',
              hint: undefined,
              value: 'new1'
            },
            {
              id: expect.any(String),
              text: 'new2',
              hint: undefined,
              value: 'new2'
            }
          ]
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

  describe('handleSaveItem', () => {
    const listItems = [
      {
        id: '1',
        text: 'Option 1',
        hint: { text: 'Hint 1' },
        value: 'Option 1'
      },
      {
        id: '2',
        text: 'Option 2',
        hint: { text: 'Hint 2' },
        value: 'Option 2'
      },
      {
        id: '3',
        text: 'Option 3',
        hint: { text: 'Hint 3' },
        value: 'Option 3'
      },
      { id: '4', text: 'Option 4', hint: { text: 'Hint 4' }, value: 'Option 4' }
    ]
    test('should perform update', () => {
      const payload = {
        radioId: '1',
        radioText: 'New Option 1',
        radioHint: 'New Hint 1',
        radioValue: 'New Option 1'
      }
      const { mockRequest } = buildMockRequest(payload)
      const mockState = structuredClone({
        listItems
      })
      const res = handleSaveItem(mockRequest, mockState, '12345')
      expect(res).toBe('#list-items')
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        '12345',
        {
          editRow: expect.anything(),
          listItems: [
            {
              id: '1',
              text: 'New Option 1',
              hint: { text: 'New Hint 1' },
              value: 'New Option 1'
            },
            {
              id: '2',
              text: 'Option 2',
              hint: { text: 'Hint 2' },
              value: 'Option 2'
            },
            {
              id: '3',
              text: 'Option 3',
              hint: { text: 'Hint 3' },
              value: 'Option 3'
            },
            {
              id: '4',
              text: 'Option 4',
              hint: { text: 'Hint 4' },
              value: 'Option 4'
            }
          ]
        }
      )
    })

    test('should perform update when no unique value supplied', () => {
      const payload = {
        radioId: '1',
        radioText: 'New Option 1',
        radioHint: 'New Hint 1',
        radioValue: ''
      }
      const { mockRequest } = buildMockRequest(payload)
      const mockState = structuredClone({
        listItems
      })
      const res = handleSaveItem(mockRequest, mockState, '12345')
      expect(res).toBe('#list-items')
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        '12345',
        {
          editRow: expect.anything(),
          listItems: [
            {
              id: '1',
              text: 'New Option 1',
              hint: { text: 'New Hint 1' },
              value: 'New Option 1'
            },
            {
              id: '2',
              text: 'Option 2',
              hint: { text: 'Hint 2' },
              value: 'Option 2'
            },
            {
              id: '3',
              text: 'Option 3',
              hint: { text: 'Hint 3' },
              value: 'Option 3'
            },
            {
              id: '4',
              text: 'Option 4',
              hint: { text: 'Hint 4' },
              value: 'Option 4'
            }
          ]
        }
      )
    })

    test('should perform update using supplied unique value', () => {
      const payload = {
        radioId: '1',
        radioText: 'New Option 1',
        radioHint: 'New Hint 1',
        radioValue: 'New val1'
      }
      const { mockRequest } = buildMockRequest(payload)
      const mockState = structuredClone({
        listItems
      })
      const res = handleSaveItem(mockRequest, mockState, '12345')
      expect(res).toBe('#list-items')
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        '12345',
        {
          editRow: expect.anything(),
          listItems: [
            {
              id: '1',
              text: 'New Option 1',
              hint: { text: 'New Hint 1' },
              value: 'New val1'
            },
            {
              id: '2',
              text: 'Option 2',
              hint: { text: 'Hint 2' },
              value: 'Option 2'
            },
            {
              id: '3',
              text: 'Option 3',
              hint: { text: 'Hint 3' },
              value: 'Option 3'
            },
            {
              id: '4',
              text: 'Option 4',
              hint: { text: 'Hint 4' },
              value: 'Option 4'
            }
          ]
        }
      )
    })

    test('should perform insert', () => {
      const payload = {
        radioId: 'new',
        radioText: 'New Option 5',
        radioHint: 'New Hint 5',
        radioValue: 'New Option 5'
      }
      const { mockRequest } = buildMockRequest(payload)
      const mockState = structuredClone({
        listItems
      })
      const res = handleSaveItem(mockRequest, mockState, '12345')
      expect(res).toBe('#list-items')
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        '12345',
        {
          editRow: expect.anything(),
          listItems: [
            {
              id: '1',
              text: 'Option 1',
              hint: { text: 'Hint 1' },
              value: 'Option 1'
            },
            {
              id: '2',
              text: 'Option 2',
              hint: { text: 'Hint 2' },
              value: 'Option 2'
            },
            {
              id: '3',
              text: 'Option 3',
              hint: { text: 'Hint 3' },
              value: 'Option 3'
            },
            {
              id: '4',
              text: 'Option 4',
              hint: { text: 'Hint 4' },
              value: 'Option 4'
            },
            {
              id: expect.any(String),
              text: 'New Option 5',
              hint: { text: 'New Hint 5' },
              value: 'New Option 5'
            }
          ]
        }
      )
    })

    test('should perform insert when no unique value supplied', () => {
      const payload = {
        radioId: 'new',
        radioText: 'New Option 5',
        radioHint: 'New Hint 5',
        radioValue: ''
      }
      const { mockRequest } = buildMockRequest(payload)
      const mockState = structuredClone({
        listItems
      })
      const res = handleSaveItem(mockRequest, mockState, '12345')
      expect(res).toBe('#list-items')
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        '12345',
        {
          editRow: expect.anything(),
          listItems: [
            {
              id: '1',
              text: 'Option 1',
              hint: { text: 'Hint 1' },
              value: 'Option 1'
            },
            {
              id: '2',
              text: 'Option 2',
              hint: { text: 'Hint 2' },
              value: 'Option 2'
            },
            {
              id: '3',
              text: 'Option 3',
              hint: { text: 'Hint 3' },
              value: 'Option 3'
            },
            {
              id: '4',
              text: 'Option 4',
              hint: { text: 'Hint 4' },
              value: 'Option 4'
            },
            {
              id: expect.any(String),
              text: 'New Option 5',
              hint: { text: 'New Hint 5' },
              value: 'New Option 5'
            }
          ]
        }
      )
    })

    test('should perform insert using supplied unique value', () => {
      const payload = {
        radioId: 'new',
        radioText: 'New Option 5',
        radioHint: 'New Hint 5',
        radioValue: 'New val 5'
      }
      const { mockRequest } = buildMockRequest(payload)
      const mockState = structuredClone({
        listItems
      })
      const res = handleSaveItem(mockRequest, mockState, '12345')
      expect(res).toBe('#list-items')
      expect(setQuestionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        '12345',
        {
          editRow: expect.anything(),
          listItems: [
            {
              id: '1',
              text: 'Option 1',
              hint: { text: 'Hint 1' },
              value: 'Option 1'
            },
            {
              id: '2',
              text: 'Option 2',
              hint: { text: 'Hint 2' },
              value: 'Option 2'
            },
            {
              id: '3',
              text: 'Option 3',
              hint: { text: 'Hint 3' },
              value: 'Option 3'
            },
            {
              id: '4',
              text: 'Option 4',
              hint: { text: 'Hint 4' },
              value: 'Option 4'
            },
            {
              id: expect.any(String),
              text: 'New Option 5',
              hint: { text: 'New Hint 5' },
              value: 'New val 5'
            }
          ]
        }
      )
    })
  })
})

/**
 * @import { FormEditorInputQuestionDetails, Item } from '@defra/forms-model'
 * @import { Request } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
