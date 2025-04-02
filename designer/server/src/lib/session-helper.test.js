import { ComponentType } from '@defra/forms-model'

import {
  clearQuestionSessionState,
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

  describe('getEnhancedActionStateFromSession', () => {
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

  describe('clearQuestionSessionState', () => {
    test('should call set', () => {
      clearQuestionSessionState(mockYar, '123')
      expect(mockSet).toHaveBeenCalledWith(
        'questionSessionState-123',
        undefined
      )
    })
  })
})

/**
 * @import { Yar } from '@hapi/yar'
 */
