import { ComponentType } from '@defra/forms-model'
import {
  buildQuestionPage,
  buildRepeaterPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { filterQuestionTypes } from '~/src/models/forms/editor-v2/question-type.js'

const testQuestionTypeItems = /** @type {FormEditorCheckbox[]} */ ([
  {
    text: 'UK address',
    hint: {
      text: 'A street address, town or city and postcode'
    },
    value: ComponentType.UkAddressField
  },
  {
    text: 'Phone number',
    hint: {
      text: 'A UK phone number, for example, 07700 900 982 or +44 808 157 0192'
    },
    value: ComponentType.TelephoneNumberField
  },
  {
    text: 'Supporting evidence',
    hint: {
      text: 'A document, for example, DOC, PDF, CSV, Excel'
    },
    value: ComponentType.FileUploadField
  },
  {
    text: 'Email address',
    hint: {
      text: 'An email address, for example, name@example.com'
    },
    value: ComponentType.EmailAddressField
  }
])

describe('editor-v2 - question type model', () => {
  describe('filterQuestionTypes', () => {
    test('should return full list if no components and new question', () => {
      const res = filterQuestionTypes(
        'new',
        testQuestionTypeItems,
        buildQuestionPage({}),
        undefined
      )
      expect(res).toHaveLength(4)
      expect(res[2].text).toBe('Supporting evidence')
    })

    test('should omit file upload if some components and new question', () => {
      const res = filterQuestionTypes(
        'new',
        testQuestionTypeItems,
        buildQuestionPage({
          components: [
            {
              name: '',
              title: '',
              type: ComponentType.TextField,
              schema: {},
              options: {}
            }
          ]
        }),
        undefined
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should omit file upload if already a file upload component and new question', () => {
      const res = filterQuestionTypes(
        'new',
        testQuestionTypeItems,
        buildQuestionPage({
          components: [
            {
              name: '',
              title: '',
              type: ComponentType.FileUploadField,
              schema: {},
              options: {}
            }
          ]
        }),
        undefined
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should omit file upload if some components and existing question', () => {
      const componentsSoFar = /** @type {ComponentDef[]} */ ([
        {
          name: '',
          title: '',
          type: ComponentType.TextField,
          schema: {},
          options: {}
        },
        {
          name: '',
          title: '',
          type: ComponentType.MultilineTextField,
          schema: {},
          options: {}
        }
      ])
      const res = filterQuestionTypes(
        '123',
        testQuestionTypeItems,
        buildQuestionPage({
          components: componentsSoFar
        }),
        undefined
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should omit file upload if page is repeater page', () => {
      const textFieldComponent = buildTextFieldComponent()
      const res = filterQuestionTypes(
        '123',
        testQuestionTypeItems,
        buildRepeaterPage({
          components: [textFieldComponent]
        }),
        undefined
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should handle omit file upload if already a file upload component on page', () => {
      const res = filterQuestionTypes(
        '123',
        testQuestionTypeItems,
        buildQuestionPage({
          components: [
            {
              name: '',
              title: '',
              type: ComponentType.FileUploadField,
              schema: {},
              options: {}
            }
          ]
        }),
        undefined
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should handle state overriding question type to FileUpload', () => {
      const textFieldComponent = buildTextFieldComponent({ id: '123' })
      const res = filterQuestionTypes(
        '123',
        testQuestionTypeItems,
        buildQuestionPage({
          components: [textFieldComponent]
        }),
        {
          questionType: ComponentType.FileUploadField
        }
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should handle state overriding question type to anything other than FileUpload', () => {
      const textFieldComponent = buildTextFieldComponent({ id: '123' })
      const res = filterQuestionTypes(
        '123',
        testQuestionTypeItems,
        buildQuestionPage({
          components: [textFieldComponent]
        }),
        {
          questionType: ComponentType.MultilineTextField
        }
      )
      expect(res).toHaveLength(4)
      expect(res[2].text).toBe('Supporting evidence')
    })
  })
})

/**
 * @import { FormEditorCheckbox, ComponentDef } from '@defra/forms-model'
 */
