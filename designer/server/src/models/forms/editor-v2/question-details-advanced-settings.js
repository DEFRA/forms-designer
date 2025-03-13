import { ComponentType } from '@defra/forms-model'

import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

/**
 * @param {string} fieldName
 * @param {FormEditor} formValues
 * @param { ErrorDetails | undefined } formErrors
 */
export function buildField(fieldName, formValues, formErrors) {
  let field
  switch (fieldName) {
    case QuestionAdvancedSettings.MinLength:
      field = {
        minLength: {
          type: ComponentType.TextField,
          name: 'minLength',
          id: 'minLength',
          label: {
            text: 'Minimum character length (optional)',
            classes: GOVUK_LABEL__M
          },
          hint: {
            text: 'The minimum number of characters users can enter'
          },
          value: formValues.minLength,
          classes: 'govuk-input--width-3',
          ...insertValidationErrors(formErrors?.minLength)
        }
      }
      break
    case QuestionAdvancedSettings.MaxLength:
      field = {
        maxLength: {
          type: ComponentType.TextField,
          name: 'maxLength',
          id: 'maxLength',
          label: {
            text: 'Maximum character length (optional)',
            classes: GOVUK_LABEL__M
          },
          hint: {
            text: 'The maximum number of characters users can enter'
          },
          value: formValues.maxLength,
          classes: 'govuk-input--width-3',
          ...insertValidationErrors(formErrors?.maxLength)
        }
      }
      break
    case QuestionAdvancedSettings.Regex:
      field = {
        regex: {
          type: ComponentType.MultilineTextField,
          name: 'regex',
          id: 'regex',
          label: {
            text: 'Regex (optional)',
            classes: GOVUK_LABEL__M
          },
          hint: {
            text: 'Specifies a regular expression to validate users’ inputs. Use JavaScript syntax'
          },
          rows: 3,
          value: formValues.regex,
          ...insertValidationErrors(formErrors?.regex)
        }
      }
      break
    case QuestionAdvancedSettings.Classes:
      field = {
        classes: {
          type: ComponentType.MultilineTextField,
          name: 'classes',
          id: 'classes',
          label: {
            text: 'Classes (optional)',
            classes: GOVUK_LABEL__M
          },
          hint: {
            text: 'Apply CSS classes to this field. For example, ‘govuk-input govuk-!-width-full’'
          },
          rows: 1,
          value: formValues.classes,
          ...insertValidationErrors(formErrors?.classes)
        }
      }
      break
  }

  return /** @type {FormEditorGovukField} */ (field)
}

/**
 * @param {TextFieldComponent} question
 */
function mapToQuestionOptions(question) {
  return {
    minLength: question.schema.min,
    maxLength: question.schema.max,
    regex: question.schema.regex,
    classes: question.options.classes
  }
}

/**
 * @param {string[]} options
 * @param {TextFieldComponent} question
 * @param {ValidationFailure<FormEditor>} [validation]
 * @returns {FormEditorGovukField[]}
 */
export function extraFields(options, question, validation) {
  const formValues = /** @type {FormEditor} */ (
    validation?.formValues ?? mapToQuestionOptions(question)
  )
  const formErrors = validation?.formErrors

  return options.map((opt) => buildField(opt, formValues, formErrors))
}

/**
 * @import { FormEditor, FormEditorGovukField, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetails, ValidationFailure } from '~/src/common/helpers/types.js'
 */
