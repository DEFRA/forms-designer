import { ComponentType } from '@defra/forms-model'

import {
  testFormDefinitionWithRadioQuestionAndList,
  testFormDefinitionWithRadioQuestionAndMislinkedList,
  testFormDefinitionWithTwoPagesAndQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  buildQuestionSessionState,
  clearQuestionSessionState,
  createConditionSessionState,
  createQuestionSessionState,
  getConditionSessionState,
  getFlashFromSession,
  getQuestionSessionState,
  mergeQuestionSessionState,
  setConditionSessionState,
  setFlashInSession,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'

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

const listWithThreeItems = {
  listItems: [
    { id: '1', text: 'text1', hint: 'hint1', value: 'value1' },
    { id: '2', text: 'text2', hint: 'hint2', value: 'value2' },
    { id: '3', text: 'text3', hint: 'hint3', value: 'value3' }
  ]
}

const exampleCondition = /** @type {ConditionSessionState} */ ({
  id: '4369c915-fa65-478b-8b04-37e9cee7eede',
  stateId: '123456',
  conditionWrapper: {
    id: 'cond-id',
    displayName: 'Condition 1',
    coordinator: 'and',
    items: []
  }
})

describe('Session functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getFlashFromSession', () => {
    test('should call flash', () => {
      mockFlash.mockReturnValue(['stored-val'])
      const res = getFlashFromSession(mockYar, 'my-key')
      expect(mockFlash).toHaveBeenCalledWith('my-key')
      expect(res).toBe('stored-val')
    })

    test('should handle undefined value', () => {
      mockFlash.mockReturnValue(undefined)
      const res = getFlashFromSession(mockYar, 'my-key')
      expect(mockFlash).toHaveBeenCalledWith('my-key')
      expect(res).toBeUndefined()
    })
  })

  describe('setFlashInSession', () => {
    test('should call flash', () => {
      setFlashInSession(mockYar, 'my-key', 'my-val')
      expect(mockFlash).toHaveBeenCalledWith('my-key', 'my-val')
    })
  })

  describe('QuestionSessionState', () => {
    describe('getQuestionSessionState', () => {
      test('should get value from session', () => {
        mockGet.mockReturnValue(structuredClone(listWithThreeItems))
        expect(getQuestionSessionState(mockYar, '123')).toEqual(
          listWithThreeItems
        )
      })
    })

    describe('setQuestionSessionState', () => {
      test('should call set', () => {
        setQuestionSessionState(mockYar, '123', {
          questionType: ComponentType.TextField
        })
        expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
          questionType: ComponentType.TextField
        })
      })
    })

    describe('mergeQuestionSessionState', () => {
      test('should call set', () => {
        mockGet.mockReturnValue(structuredClone({}))
        mergeQuestionSessionState(mockYar, '123', {
          questionType: ComponentType.TextField
        })
        expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
          questionType: ComponentType.TextField
        })
      })

      test('should merge', () => {
        mockGet.mockReturnValue(
          structuredClone({
            questionType: ComponentType.RadiosField,
            otherField: '123'
          })
        )
        mergeQuestionSessionState(mockYar, '123', {
          questionType: ComponentType.TextField
        })
        expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
          questionType: ComponentType.TextField,
          otherField: '123'
        })
      })
    })

    describe('createQuestionSessionState', () => {
      test('should call set', () => {
        const stateId = createQuestionSessionState(mockYar)
        expect(stateId).toBeDefined()
        expect(mockSet).toHaveBeenCalledWith(
          `questionSessionState-${stateId}`,
          {}
        )
      })
    })

    describe('clearQuestionSessionState', () => {
      test('should call set', () => {
        clearQuestionSessionState(mockYar, '123')
        expect(mockSet).toHaveBeenCalledWith(
          'questionSessionState-123',
          undefined
        )
      })
    })

    describe('buildQuestionSessionState', () => {
      test('should ignore if not a question that uses lists', () => {
        mockGet.mockReturnValue({ questionType: ComponentType.TextField })
        const res = buildQuestionSessionState(
          mockYar,
          '123',
          testFormDefinitionWithTwoPagesAndQuestions,
          'p1',
          'q1'
        )
        expect(mockSet).not.toHaveBeenCalled()
        expect(res).toEqual({ questionType: ComponentType.TextField })
      })

      test('should ignore if already a list defined', () => {
        mockGet.mockReturnValue({
          questionType: ComponentType.RadiosField,
          listItems: []
        })
        const res = buildQuestionSessionState(
          mockYar,
          '123',
          testFormDefinitionWithTwoPagesAndQuestions,
          'p1',
          'q1'
        )
        expect(mockSet).not.toHaveBeenCalled()
        expect(res).toEqual({
          questionType: ComponentType.RadiosField,
          listItems: []
        })
      })

      test('should build if required', () => {
        mockGet.mockReturnValue({ questionType: ComponentType.RadiosField })
        const res = buildQuestionSessionState(
          mockYar,
          '123',
          testFormDefinitionWithRadioQuestionAndList,
          'p1',
          'q1'
        )
        const expectedState = {
          editRow: {},
          listItems: [
            { id: expect.any(String), text: 'Blue', value: 'blue' },
            { id: expect.any(String), text: 'Red', value: 'red' },
            { id: expect.any(String), text: 'Green', value: 'green' }
          ],
          questionType: 'RadiosField'
        }
        expect(mockSet).toHaveBeenCalledWith(
          'questionSessionState-123',
          expectedState
        )
        expect(res).toEqual(expectedState)
      })

      test('should handle mis-linked list', () => {
        mockGet.mockReturnValue({ questionType: ComponentType.RadiosField })
        const res = buildQuestionSessionState(
          mockYar,
          '123',
          testFormDefinitionWithRadioQuestionAndMislinkedList,
          'p1',
          'q1'
        )
        const expectedState = {
          editRow: {},
          listItems: [],
          questionType: 'RadiosField'
        }
        expect(mockSet).toHaveBeenCalledWith(
          'questionSessionState-123',
          expectedState
        )
        expect(res).toEqual(expectedState)
      })
    })
  })

  describe('CondiionSessionState', () => {
    describe('getConditionSessionState', () => {
      test('should get value from session', () => {
        mockGet.mockReturnValue(structuredClone(exampleCondition))
        expect(getConditionSessionState(mockYar, '123456')).toEqual(
          exampleCondition
        )
      })
    })

    describe('setConditionSessionState', () => {
      test('should call set', () => {
        setConditionSessionState(mockYar, '123456', {
          id: 'cond1'
        })
        expect(mockSet).toHaveBeenCalledWith('conditionSessionState-123456', {
          id: 'cond1'
        })
      })
    })

    describe('createConditionSessionState', () => {
      test('should call set', () => {
        const stateId = createConditionSessionState(mockYar)
        expect(stateId).toBeDefined()
        expect(mockSet).toHaveBeenCalledWith(
          `conditionSessionState-${stateId}`,
          {}
        )
      })
    })
  })
})

/**
 * @import { ConditionSessionState } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
