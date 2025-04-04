import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import {
  handleEnhancedActionOnGet,
  handleEnhancedActionOnPost,
  setEditRowState
} from '~/src/routes/forms/editor-v2/question-details-helper.js'

const mockFlash = jest.fn().mockImplementation(() => ['UkAddress'])
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

const simpleSession = {
  questionType: 'RadiosField'
}

const sessionWithListWithThreeItems = {
  questionType: 'RadiosField',
  listItems: listWithThreeItems.listItems
}

describe('Editor v2 question-details route helper', () => {
  describe('getQuestionSessionState', () => {
    test('should get value from session', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))
      expect(getQuestionSessionState(mockYar, '123')).toEqual(
        listWithThreeItems
      )
    })
  })

  describe('setEditRowState', () => {
    test('should set state if values supplied', () => {
      expect(
        setEditRowState(
          {
            id: '12345',
            text: 'text1',
            hint: 'hint1',
            value: 'value1'
          },
          false
        )
      ).toEqual({
        radioId: '12345',
        radioText: 'text1',
        radioHint: 'hint1',
        radioValue: 'value1',
        expanded: false
      })
    })

    test('should set default state', () => {
      expect(setEditRowState(undefined, true)).toEqual({
        radioId: '',
        radioText: '',
        radioHint: '',
        radioValue: '',
        expanded: true
      })
    })
  })

  describe('handleEnhancedActionOnGet', () => {
    test('should ignore if no action', () => {
      mockGet.mockReturnValue(structuredClone(simpleSession))
      expect(handleEnhancedActionOnGet(mockYar, '123', {})).toBeUndefined()
    })

    test('should ignore if action not edit, delete or cancel', () => {
      mockGet.mockReturnValue(structuredClone(simpleSession))
      expect(
        handleEnhancedActionOnGet(mockYar, '123', { action: 'invalid' })
      ).toBeUndefined()
    })

    test('should throw if bad session', () => {
      mockGet.mockReturnValue(undefined)
      expect(() =>
        handleEnhancedActionOnGet(mockYar, '123', { action: 'add-item' })
      ).toThrow('Invalid session contents')
    })

    test('delete should remove item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, '123', { action: 'delete', id: '2' })
      ).toBe('#list-items')
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: [
          { id: '1', text: 'text1', hint: 'hint1', value: 'value1' },
          { id: '3', text: 'text3', hint: 'hint3', value: 'value3' }
        ]
      })
    })

    test('edit should populate item in fields', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, '123', { action: 'edit', id: '2' })
      ).toBe('#add-option-form')
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        editRow: {
          radioId: '2',
          radioText: 'text2',
          radioHint: 'hint2',
          radioValue: 'value2',
          expanded: true
        },
        listItems: [
          { hint: 'hint1', id: '1', text: 'text1', value: 'value1' },
          { hint: 'hint2', id: '2', text: 'text2', value: 'value2' },
          { hint: 'hint3', id: '3', text: 'text3', value: 'value3' }
        ]
      })
    })

    test('cancel should close expanded area', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, '123', { action: 'cancel' })
      ).toBe('#list-items')
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        editRow: {
          radioId: '',
          radioText: '',
          radioHint: '',
          radioValue: '',
          expanded: false
        },
        listItems: [
          { hint: 'hint1', id: '1', text: 'text1', value: 'value1' },
          { hint: 'hint2', id: '2', text: 'text2', value: 'value2' },
          { hint: 'hint3', id: '3', text: 'text3', value: 'value3' }
        ]
      })
    })
  })

  describe('handleEnhancedActionOnPost', () => {
    test('should ignore if no action', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({})
      expect(
        handleEnhancedActionOnPost(mockYar, '123', payload, {})
      ).toBeUndefined()
    })

    test('should ignore if action not add-item or save-item', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'invalid'
      })
      expect(
        handleEnhancedActionOnPost(mockYar, '123', payload, {})
      ).toBeUndefined()
    })

    test('should throw if bad session', () => {
      mockGet.mockReturnValue(undefined)
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'add-item'
      })
      expect(() =>
        handleEnhancedActionOnPost(mockYar, '123', payload, {})
      ).toThrow('Invalid session contents')
    })

    test('add-item should add item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'add-item',
        radioId: '5',
        radioText: 'text5',
        radioHint: 'hint5',
        radioValue: 'value5'
      })

      expect(handleEnhancedActionOnPost(mockYar, '123', payload, {})).toBe(
        '#add-option'
      )
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: listWithThreeItems.listItems,
        editRow: {
          radioId: '5',
          radioText: 'text5',
          radioHint: 'hint5',
          radioValue: 'value5',
          expanded: true
        },
        questionDetails: {}
      })
    })

    test('save-item should update existing item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '3',
        radioText: 'text3x',
        radioHint: 'hint3x',
        radioValue: 'value3x'
      })

      expect(handleEnhancedActionOnPost(mockYar, '123', payload, {})).toBe(
        '#list-items'
      )
      const expectedList = [
        { id: '1', text: 'text1', hint: 'hint1', value: 'value1' },
        { id: '2', text: 'text2', hint: 'hint2', value: 'value2' },
        { id: '3', text: 'text3x', hint: 'hint3x', value: 'value3x' }
      ]
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: expectedList,
        editRow: {
          radioId: '',
          radioText: '',
          radioHint: '',
          radioValue: '',
          expanded: false
        },
        questionDetails: {}
      })
    })

    test('save-item should add new item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '5',
        radioText: 'text5',
        radioHint: 'hint5',
        radioValue: 'value5'
      })

      expect(handleEnhancedActionOnPost(mockYar, '123', payload, {})).toBe(
        '#list-items'
      )
      const expectedList = [
        { id: '1', text: 'text1', hint: 'hint1', value: 'value1' },
        { id: '2', text: 'text2', hint: 'hint2', value: 'value2' },
        { id: '3', text: 'text3', hint: 'hint3', value: 'value3' },
        {
          id: expect.anything(),
          text: 'text5',
          hint: 'hint5',
          value: 'value5'
        }
      ]
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: expectedList,
        editRow: {
          radioId: '',
          radioText: '',
          radioHint: '',
          radioValue: '',
          expanded: false
        },
        questionDetails: {}
      })
    })
  })
})

/**
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
