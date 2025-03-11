import { insertValidationErrors } from '~/src/lib/utils.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

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
 * @param {TextFieldComponent} question
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function textfieldExtraOptionsFields(question, validation) {
  const formValues = validation?.formValues ?? mapToQuestionOptions(question)

  return {
    optionalFieldsPartial: 'question-details-textfield.njk',
    fields: {
      minLength: {
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
        ...insertValidationErrors(validation?.formErrors.minLength)
      },
      maxLength: {
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
        ...insertValidationErrors(validation?.formErrors.maxLength)
      },
      regex: {
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
        ...insertValidationErrors(validation?.formErrors.regex)
      },
      classes: {
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
        ...insertValidationErrors(validation?.formErrors.classes)
      }
    }
  }
}

/**
 * @import { FormEditor, TextFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
