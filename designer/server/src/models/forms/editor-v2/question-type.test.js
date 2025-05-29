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
        [],
        undefined
      )
      expect(res).toHaveLength(4)
      expect(res[2].text).toBe('Supporting evidence')
    })

    test('should omit file upload if some components and new question', () => {
      const res = filterQuestionTypes(
        'new',
        testQuestionTypeItems,
        [
          {
            name: '',
            title: '',
            type: ComponentType.TextField,
            schema: {},
            options: {}
          }
        ],
        undefined
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should omit file upload if already a file upload component and new question', () => {
      const res = filterQuestionTypes(
        'new',
        testQuestionTypeItems,
        [
          {
            name: '',
            title: '',
            type: ComponentType.FileUploadField,
            schema: {},
            options: {}
          }
        ],
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
        componentsSoFar,
        buildQuestionPage({
          components: componentsSoFar
        })
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })

    test('should omit file upload if page is repeater page', () => {
      const textFieldComponent = buildTextFieldComponent()
      const res = filterQuestionTypes(
        '123',
        testQuestionTypeItems,
        [textFieldComponent],
        buildRepeaterPage({
          components: [textFieldComponent]
        })
      )
      expect(res).toHaveLength(3)
      expect(res[2].text).toBe('Email address')
    })
  })
})

/**
 * @import { FormEditorCheckbox, ComponentDef } from '@defra/forms-model'
 */
