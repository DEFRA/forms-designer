import {
  getEnhancedActionStateFromSession,
  handleEnhancedActionOnGet,
  handleEnhancedActionOnPost,
  setItemState
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
    { id: '1', label: 'label1', hint: 'hint1', value: 'value1' },
    { id: '2', label: 'label2', hint: 'hint2', value: 'value2' },
    { id: '3', label: 'label3', hint: 'hint3', value: 'value3' }
  ]
}

describe('Editor v2 question-details route helper', () => {
  describe('getEnhancedActionStateFromSession', () => {
    test('should get value from session', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))
      expect(getEnhancedActionStateFromSession(mockYar)).toEqual(
        listWithThreeItems
      )
    })
  })

  describe('setItemState', () => {
    test('should set state if values supplied', () => {
      expect(
        setItemState(
          {
            id: '12345',
            label: 'label1',
            hint: 'hint1',
            value: 'value1'
          },
          false
        )
      ).toEqual({
        radioId: '12345',
        radioLabel: 'label1',
        radioHint: 'hint1',
        radioValue: 'value1',
        expanded: false
      })
    })

    test('should set default state', () => {
      expect(setItemState(undefined, true)).toEqual({
        radioId: '',
        radioLabel: '',
        radioHint: '',
        radioValue: '',
        expanded: true
      })
    })
  })

  describe('handleEnhancedActionOnGet', () => {
    test('should ignore if no action', () => {
      expect(handleEnhancedActionOnGet(mockYar, {})).toBeUndefined()
    })

    test('should ignore if action not edit, delete or cancel', () => {
      expect(
        handleEnhancedActionOnGet(mockYar, { action: 'invalid' })
      ).toBeUndefined()
    })

    test('delete should remove item', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, { action: 'delete', id: '2' })
      ).toBe('#list-items')
      expect(mockSet).toHaveBeenCalledWith('enhancedActionState', {
        listItems: [
          { id: '1', label: 'label1', hint: 'hint1', value: 'value1' },
          { id: '3', label: 'label3', hint: 'hint3', value: 'value3' }
        ]
      })
    })

    test('edit should populate item in fields', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, { action: 'edit', id: '2' })
      ).toBe('#add-option-form')
      expect(mockSet).toHaveBeenCalledWith('enhancedActionState', {
        state: {
          radioId: '2',
          radioLabel: 'label2',
          radioHint: 'hint2',
          radioValue: 'value2',
          expanded: true
        },
        listItems: [
          { hint: 'hint1', id: '1', label: 'label1', value: 'value1' },
          { hint: 'hint2', id: '2', label: 'label2', value: 'value2' },
          { hint: 'hint3', id: '3', label: 'label3', value: 'value3' }
        ]
      })
    })

    test('cancel should close expanded area', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))

      expect(handleEnhancedActionOnGet(mockYar, { action: 'cancel' })).toBe(
        '#list-items'
      )
      expect(mockSet).toHaveBeenCalledWith('enhancedActionState', {
        state: {
          radioId: '',
          radioLabel: '',
          radioHint: '',
          radioValue: '',
          expanded: false
        },
        listItems: [
          { hint: 'hint1', id: '1', label: 'label1', value: 'value1' },
          { hint: 'hint2', id: '2', label: 'label2', value: 'value2' },
          { hint: 'hint3', id: '3', label: 'label3', value: 'value3' }
        ]
      })
    })
  })

  describe('handleEnhancedActionOnPost', () => {
    test('should ignore if no action', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({})
      expect(handleEnhancedActionOnPost(mockYar, payload, {})).toBeUndefined()
    })

    test('should ignore if action not add-item or save-item', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'invalid'
      })
      expect(handleEnhancedActionOnPost(mockYar, payload, {})).toBeUndefined()
    })

    test('add-item should add item', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'add-item',
        radioId: '5',
        radioLabel: 'label5',
        radioHint: 'hint5',
        radioValue: 'value5'
      })

      expect(handleEnhancedActionOnPost(mockYar, payload, {})).toBe(
        '#add-option'
      )
      expect(mockSet).toHaveBeenCalledWith('enhancedActionState', {
        listItems: listWithThreeItems.listItems,
        state: {
          radioId: '5',
          radioLabel: 'label5',
          radioHint: 'hint5',
          radioValue: 'value5',
          expanded: true
        },
        questionDetails: {}
      })
    })

    test('save-item should update existing item', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '3',
        radioLabel: 'label3x',
        radioHint: 'hint3x',
        radioValue: 'value3x'
      })

      expect(handleEnhancedActionOnPost(mockYar, payload, {})).toBe(
        '#list-items'
      )
      const expectedList = [
        { id: '1', label: 'label1', hint: 'hint1', value: 'value1' },
        { id: '2', label: 'label2', hint: 'hint2', value: 'value2' },
        { id: '3', label: 'label3x', hint: 'hint3x', value: 'value3x' }
      ]
      expect(mockSet).toHaveBeenCalledWith('enhancedActionState', {
        listItems: expectedList,
        state: {
          radioId: '',
          radioLabel: '',
          radioHint: '',
          radioValue: '',
          expanded: false
        },
        questionDetails: {}
      })
    })

    test('save-item should add new item', () => {
      mockGet.mockReturnValue(structuredClone(listWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '5',
        radioLabel: 'label5',
        radioHint: 'hint5',
        radioValue: 'value5'
      })

      expect(handleEnhancedActionOnPost(mockYar, payload, {})).toBe(
        '#list-items'
      )
      const expectedList = [
        { id: '1', label: 'label1', hint: 'hint1', value: 'value1' },
        { id: '2', label: 'label2', hint: 'hint2', value: 'value2' },
        { id: '3', label: 'label3', hint: 'hint3', value: 'value3' },
        {
          id: expect.anything(),
          label: 'label5',
          hint: 'hint5',
          value: 'value5'
        }
      ]
      expect(mockSet).toHaveBeenCalledWith('enhancedActionState', {
        listItems: expectedList,
        state: {
          radioId: '',
          radioLabel: '',
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
 * @import { FormEditor, FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
