import { ExtensionType } from '@defra/forms-model'

import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import {
  buildItemExtensions,
  enforceFileUploadFieldExclusivity,
  handleEnhancedActionOnGet,
  handleEnhancedActionOnPost,
  isValidExclusivePosition,
  repositionListItem,
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

const listWithThreeItems = {
  listItems: [
    { id: '1', text: 'text1', value: 'value1' },
    { id: '2', text: 'text2', hint: { text: 'hint2' }, value: 'value2' },
    { id: '3', text: 'text3', hint: { text: 'hint3' }, value: 'value3' }
  ]
}

const simpleSession = {
  questionType: 'RadiosField'
}

const sessionWithListWithThreeItems = {
  questionType: 'RadiosField',
  listItems: listWithThreeItems.listItems
}

/** @type {Exclusive} */
const exclusiveExtension = { type: ExtensionType.Exclusive }

/** @type {AdditionalQuestion} */
const additionalQuestionExtension = {
  type: ExtensionType.AdditionalQuestion,
  id: '4d7c8e2a-1f3b-4a5c-9d6e-7f8a9b0c1d2e',
  name: 'abcdef',
  title: 'Give a reason',
  options: { required: true },
  schema: {}
}

const sessionWithExclusiveLastItem = {
  questionType: 'CheckboxesField',
  listItems: [
    { id: '1', text: 'text1', value: 'value1' },
    { id: '2', text: 'text2', value: 'value2' },
    {
      id: '3',
      text: 'None of the above',
      value: 'none',
      extensions: [exclusiveExtension]
    }
  ]
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
            hint: {
              text: 'hint1'
            },
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

    test('should flag an exclusive item with no follow-up question', () => {
      expect(
        setEditRowState(
          {
            id: '3',
            text: 'None of the above',
            value: 'none',
            extensions: [exclusiveExtension]
          },
          false
        )
      ).toEqual({
        radioId: '3',
        radioText: 'None of the above',
        radioHint: '',
        radioValue: 'none',
        radioExclusive: true,
        expanded: false
      })
    })

    test('should populate the follow-up question fields', () => {
      expect(
        setEditRowState(
          {
            id: '3',
            text: 'None of the above',
            value: 'none',
            extensions: [
              exclusiveExtension,
              {
                ...additionalQuestionExtension,
                hint: 'Tell us why',
                options: { required: false },
                schema: { max: 200 }
              }
            ]
          },
          true
        )
      ).toEqual({
        radioId: '3',
        radioText: 'None of the above',
        radioHint: '',
        radioValue: 'none',
        radioExclusive: true,
        radioAdditionalTitle: 'Give a reason',
        radioAdditionalHint: 'Tell us why',
        radioAdditionalMaxLength: 200,
        radioAdditionalOptional: true,
        expanded: true
      })
    })
  })

  describe('buildItemExtensions', () => {
    test('should return no extensions when the item is not exclusive', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        radioText: 'text',
        radioAdditionalTitle: 'Give a reason'
      })

      expect(buildItemExtensions(payload, undefined)).toEqual([])
    })

    test('should return only the exclusive extension when there is no follow-up question', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        radioText: 'None of the above',
        radioExclusive: true
      })

      expect(buildItemExtensions(payload, undefined)).toEqual([
        exclusiveExtension
      ])
    })

    test('should ignore a follow-up question of only whitespace', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        radioText: 'None of the above',
        radioExclusive: true,
        radioAdditionalTitle: '   '
      })

      expect(buildItemExtensions(payload, undefined)).toEqual([
        exclusiveExtension
      ])
    })

    test('should build a follow-up question with a new id and name', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        radioText: 'None of the above',
        radioExclusive: true,
        radioAdditionalTitle: '  Give a reason  ',
        radioAdditionalHint: 'Tell us why',
        radioAdditionalMaxLength: 200
      })

      expect(buildItemExtensions(payload, undefined)).toEqual([
        exclusiveExtension,
        {
          type: ExtensionType.AdditionalQuestion,
          id: expect.any(String),
          name: expect.any(String),
          title: 'Give a reason',
          hint: 'Tell us why',
          options: { required: true },
          schema: { max: 200 }
        }
      ])
    })

    test('should keep the id and name of an existing follow-up question', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        radioText: 'None of the above',
        radioExclusive: true,
        radioAdditionalTitle: 'A different question',
        radioAdditionalOptional: true
      })

      const existingItem = {
        id: '3',
        text: 'None of the above',
        value: 'none',
        extensions: [exclusiveExtension, additionalQuestionExtension]
      }

      expect(buildItemExtensions(payload, existingItem)).toEqual([
        exclusiveExtension,
        {
          type: ExtensionType.AdditionalQuestion,
          id: additionalQuestionExtension.id,
          name: additionalQuestionExtension.name,
          title: 'A different question',
          options: { required: false },
          schema: {}
        }
      ])
    })
  })

  describe('isValidExclusivePosition', () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }]

    test.each([
      [0, true],
      [1, false],
      [2, true]
    ])('index %i should be %s', (idx, expected) => {
      expect(isValidExclusivePosition(items, idx)).toBe(expected)
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
      ).toBe('/delete-list-item/2')
      expect(mockSet).not.toHaveBeenCalled()
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
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
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
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
        ]
      })
    })

    test('reorder should set isReordering flag', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, '123', { action: 'reorder' })
      ).toBe('#list-items')
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        isReordering: true,
        editRow: { expanded: false },
        listItems: [
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
        ]
      })
    })

    test('done-reordering should clear isReordering flag', () => {
      mockGet.mockReturnValue(
        structuredClone({
          ...sessionWithListWithThreeItems,
          isReordering: true
        })
      )

      expect(
        handleEnhancedActionOnGet(mockYar, '123', { action: 'done-reordering' })
      ).toBe('#list-items')
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        isReordering: false,
        listItems: [
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
        ],
        editRow: {
          expanded: false
        }
      })
    })

    test('move up should reposition item properly', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, '123', {
          action: 'move',
          id: '3',
          direction: 'up'
        })
      ).toBe('#')

      // up to position 2
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: [
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' },
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' }
        ],
        lastMovedId: '3',
        lastMoveDirection: 'up'
      })
    })

    test('move down should reposition item properly', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      expect(
        handleEnhancedActionOnGet(mockYar, '123', {
          action: 'move',
          id: '1',
          direction: 'down'
        })
      ).toBe('#')

      // down to position 2
      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: [
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' },
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
        ],
        lastMovedId: '1',
        lastMoveDirection: 'down'
      })
    })

    test('move should handle invalid moves gracefully', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      // try to move first item up (should not change list!)
      expect(
        handleEnhancedActionOnGet(mockYar, '123', {
          action: 'move',
          id: '1',
          direction: 'up'
        })
      ).toBe('#')

      expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
        questionType: 'RadiosField',
        listItems: [
          { id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint2' }, id: '2', text: 'text2', value: 'value2' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
        ],
        lastMovedId: '1',
        lastMoveDirection: 'up'
      })
    })
  })

  describe('handleEnhancedActionOnPost', () => {
    test('should ignore if no action', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({})

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBeUndefined()
    })

    test('should ignore if action not add-item or save-item or re-order', () => {
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'invalid'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBeUndefined()
    })

    test('should throw if bad session', () => {
      mockGet.mockReturnValue(undefined)
      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'add-item'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(() => handleEnhancedActionOnPost(mockRequest, '123', {})).toThrow(
        'Invalid session contents'
      )
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

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#add-option-form'
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

    test('re-order should do nothing until implemented', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 're-order'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
    })

    test.each([
      'add-conditional-amount',
      'save-conditional-amount',
      'cancel-conditional-amount'
    ])(
      '%s stages questionDetails into session before delegating',
      (enhancedAction) => {
        mockGet.mockReturnValue({
          questionType: 'PaymentField',
          conditionalAmounts: []
        })

        const payload = /** @type {FormEditorInputQuestionDetails} */ ({
          enhancedAction,
          conditionalAmount: '5',
          conditionalAmountCondition: 'cond1'
        })
        const questionDetails = /** @type {any} */ ({
          type: 'PaymentField',
          options: { amount: 12.5, description: 'Application fee' }
        })

        const { mockRequest } = buildMockRequest(payload)

        handleEnhancedActionOnPost(mockRequest, '123', questionDetails)

        expect(mockSet).toHaveBeenCalledWith('questionSessionState-123', {
          questionType: 'PaymentField',
          conditionalAmounts: [],
          questionDetails
        })
      }
    )
  })

  describe('save-item', () => {
    test('should handle simple no list items', () => {
      mockGet.mockReturnValue(structuredClone(simpleSession))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '1',
        radioText: 'text',
        radioHint: '',
        radioValue: 'value'
      })
      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
      const expectedList = [
        {
          id: expect.any(String),
          text: 'text',
          hint: undefined,
          value: 'value'
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
    test('save-item should update existing item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '3',
        radioText: 'text3x',
        radioHint: 'hint3x',
        radioValue: 'value3x'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
      const expectedList = [
        { id: '1', text: 'text1', value: 'value1' },
        { id: '2', text: 'text2', hint: { text: 'hint2' }, value: 'value2' },
        {
          id: '3',
          text: 'text3x',
          hint: { text: 'hint3x' },
          value: 'value3x'
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

    test('save-item should add new item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '5',
        radioText: 'text5',
        radioHint: '',
        radioValue: 'value5'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
      const expectedList = [
        { id: '1', text: 'text1', value: 'value1' },
        { id: '2', text: 'text2', hint: { text: 'hint2' }, value: 'value2' },
        { id: '3', text: 'text3', hint: { text: 'hint3' }, value: 'value3' },
        {
          id: expect.anything(),
          text: 'text5',
          hint: undefined,
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

    test('save-item should error if duplicate item', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '5',
        radioText: 'text3',
        radioHint: 'hint5',
        radioValue: 'value5'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe('#')
      expect(mockSet).not.toHaveBeenCalled()
      expect(mockFlash).toHaveBeenCalledWith(
        'questionDetailsValidationFailure',
        {
          formErrors: {
            radioText: {
              href: '#radioText',
              text: 'Item text must be unique in the list on item 4'
            }
          },
          formValues: {
            enhancedAction: 'save-item',
            radioHint: 'hint5',
            radioId: '5',
            radioText: 'text3',
            radioValue: 'value5'
          }
        }
      )
    })

    test('save-item should store the exclusive extension', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '3',
        radioText: 'None of the above',
        radioValue: 'none',
        radioExclusive: true,
        radioAdditionalTitle: 'Give a reason',
        radioAdditionalMaxLength: 200
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
      expect(mockSet).toHaveBeenCalledWith(
        'questionSessionState-123',
        expect.objectContaining({
          listItems: [
            { id: '1', text: 'text1', value: 'value1' },
            {
              id: '2',
              text: 'text2',
              hint: { text: 'hint2' },
              value: 'value2'
            },
            {
              id: '3',
              text: 'None of the above',
              hint: undefined,
              value: 'none',
              extensions: [
                exclusiveExtension,
                {
                  type: ExtensionType.AdditionalQuestion,
                  id: expect.any(String),
                  name: expect.any(String),
                  title: 'Give a reason',
                  options: { required: true },
                  schema: { max: 200 }
                }
              ]
            }
          ]
        })
      )
    })

    test('save-item should reject an exclusive item in the middle of the list', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithListWithThreeItems))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '2',
        radioText: 'None of the above',
        radioValue: 'none',
        radioExclusive: true
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe('#')
      expect(mockSet).not.toHaveBeenCalled()
      expect(mockFlash).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          formErrors: {
            radioExclusive: expect.objectContaining({
              text: 'A ‘none of the above’ item must be the first or the last item in the list'
            })
          }
        })
      )
    })

    test('save-item should drop the extensions of the item that was exclusive', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithExclusiveLastItem))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '1',
        radioText: 'Prefer not to say',
        radioValue: 'prefer-not-to-say',
        radioExclusive: true
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
      expect(mockSet).toHaveBeenCalledWith(
        'questionSessionState-123',
        expect.objectContaining({
          listItems: [
            {
              id: '1',
              text: 'Prefer not to say',
              hint: undefined,
              value: 'prefer-not-to-say',
              extensions: [exclusiveExtension]
            },
            { id: '2', text: 'text2', value: 'value2' },
            { id: '3', text: 'None of the above', value: 'none' }
          ]
        })
      )
    })

    test('save-item should remove the extensions when the exclusive box is cleared', () => {
      mockGet.mockReturnValue(structuredClone(sessionWithExclusiveLastItem))

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        enhancedAction: 'save-item',
        radioId: '3',
        radioText: 'None of the above',
        radioValue: 'none'
      })

      const { mockRequest } = buildMockRequest(payload)

      expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
        '#list-items'
      )
      expect(mockSet).toHaveBeenCalledWith(
        'questionSessionState-123',
        expect.objectContaining({
          listItems: [
            { id: '1', text: 'text1', value: 'value1' },
            { id: '2', text: 'text2', value: 'value2' },
            {
              id: '3',
              text: 'None of the above',
              hint: undefined,
              value: 'none'
            }
          ]
        })
      )
    })
  })

  test('done-reordering post should clear isReordering flag', () => {
    mockGet.mockReturnValue(
      structuredClone({
        ...sessionWithListWithThreeItems,
        isReordering: true
      })
    )

    const payload = /** @type {FormEditorInputQuestionDetails} */ ({
      enhancedAction: 'done-reordering'
    })

    const { mockRequest } = buildMockRequest(payload)

    expect(handleEnhancedActionOnPost(mockRequest, '123', {})).toBe(
      '#list-items'
    )
    expect(mockSet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        isReordering: false
      })
    )
  })

  describe('repositionListItem', () => {
    test('should handle zero items in list', () => {
      expect(repositionListItem([], 'up', 'itemId')).toEqual([])
    })

    test('should refuse a move that strands the exclusive item mid-list', () => {
      const listItems = structuredClone(sessionWithExclusiveLastItem.listItems)

      expect(repositionListItem(listItems, 'up', '3')).toBe(listItems)
    })

    test('should allow the exclusive item to move from one end to the other', () => {
      const listItems = [
        {
          id: '1',
          text: 'None of the above',
          value: 'none',
          extensions: [exclusiveExtension]
        },
        { id: '2', text: 'text2', value: 'value2' }
      ]

      expect(repositionListItem(listItems, 'down', '1')).toEqual([
        { id: '2', text: 'text2', value: 'value2' },
        {
          id: '1',
          text: 'None of the above',
          value: 'none',
          extensions: [exclusiveExtension]
        }
      ])
    })

    test('should allow a move that leaves the exclusive item at the end', () => {
      const listItems = structuredClone(sessionWithExclusiveLastItem.listItems)

      expect(repositionListItem(listItems, 'down', '1')).toEqual([
        listItems[1],
        listItems[0],
        listItems[2]
      ])
    })
  })

  describe('enforceFileUploadFieldExclusivity', () => {
    test('should clear minFiles and maxFiles when exactFiles has a value', () => {
      const payload = /** @type {FormEditorInputQuestion} */ ({
        questionType: 'FileUploadField',
        exactFiles: '5',
        minFiles: '2',
        maxFiles: '10'
      })

      const result = enforceFileUploadFieldExclusivity(payload)

      expect(result.minFiles).toBe('')
      expect(result.maxFiles).toBe('')
      expect(result.exactFiles).toBe('5')
      expect(result).toBe(payload)
    })

    test('should not modify minFiles and maxFiles when exactFiles is empty', () => {
      const payload = /** @type {FormEditorInputQuestion} */ ({
        questionType: 'FileUploadField',
        exactFiles: '',
        minFiles: '2',
        maxFiles: '10'
      })

      const result = enforceFileUploadFieldExclusivity(payload)

      expect(result.minFiles).toBe('2')
      expect(result.maxFiles).toBe('10')
      expect(result.exactFiles).toBe('')
    })

    test('should not modify minFiles and maxFiles when exactFiles is undefined', () => {
      const payload = /** @type {FormEditorInputQuestion} */ ({
        questionType: 'FileUploadField',
        minFiles: '2',
        maxFiles: '10'
      })

      const result = enforceFileUploadFieldExclusivity(payload)

      expect(result.minFiles).toBe('2')
      expect(result.maxFiles).toBe('10')
      expect(result.exactFiles).toBeUndefined()
    })

    test('should not modify payload when questionType is not FileUploadField', () => {
      const payload = /** @type {FormEditorInputQuestion} */ ({
        questionType: 'TextField',
        exactFiles: '5',
        minFiles: '2',
        maxFiles: '10'
      })

      const result = enforceFileUploadFieldExclusivity(payload)

      expect(result.minFiles).toBe('2')
      expect(result.maxFiles).toBe('10')
      expect(result.exactFiles).toBe('5')
    })
  })
})

/**
 * @import { AdditionalQuestion, Exclusive, FormEditorInputQuestionDetails, FormEditorInputQuestion } from '@defra/forms-model'
 * @import { Request } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
