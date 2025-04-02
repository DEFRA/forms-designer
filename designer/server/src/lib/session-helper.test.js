import { ComponentType } from '@defra/forms-model'

import {
  testFormDefinitionWithRadioQuestionAndList,
  testFormDefinitionWithTwoPagesAndQuestions
} from '~/src/__stubs__/form-definition.js'
import {
  buildQuestionSessionState,
  clearQuestionSessionState,
  createQuestionSessionState,
  getFlashFromSession,
  getQuestionSessionState,
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
    { id: '1', label: 'label1', hint: 'hint1', value: 'value1' },
    { id: '2', label: 'label2', hint: 'hint2', value: 'value2' },
    { id: '3', label: 'label3', hint: 'hint3', value: 'value3' }
  ]
}

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
          { id: expect.any(String), label: 'Blue', value: 'blue' },
          { id: expect.any(String), label: 'Red', value: 'red' },
          { id: expect.any(String), label: 'Green', value: 'green' }
        ],
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

/**
 * @import { Yar } from '@hapi/yar'
 */
