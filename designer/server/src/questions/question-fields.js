import {
  GOVUK_INPUT_WIDTH_3,
  GOVUK_LABEL__M
} from '~/src/models/forms/editor-v2/common.js'

/** @type {GovukField} */
export const question = {
  name: 'question',
  id: 'question',
  label: {
    text: 'Question',
    classes: GOVUK_LABEL__M
  }
}

/** @type {GovukField} */
export const hintText = {
  name: 'hintText',
  id: 'hintText',
  label: {
    text: 'Hint text (optional)',
    classes: GOVUK_LABEL__M
  },
  rows: 3
}

/** @type {GovukField} */
export const questionOptional = {
  name: 'questionOptional',
  id: 'questionOptional',
  classes: 'govuk-checkboxes--small',
  // @ts-expect-error - TODO correct the type
  options: {
    required: false
  },
  items: [
    {
      value: 'true',
      text: 'Make this question optional',
      checked: false
    }
  ]
}

/** @type {GovukField} */
export const shortDescription = {
  id: 'shortDescription',
  name: 'shortDescription',
  idPrefix: 'shortDescription',
  label: {
    text: 'Short description',
    classes: GOVUK_LABEL__M
  },
  hint: {
    text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
  }
}

/** @type {GovukField} */
export const minLength = {
  name: 'minLength',
  id: 'minLength',
  label: {
    text: 'Minimum character length (optional)',
    classes: GOVUK_LABEL__M
  },
  hint: {
    text: 'The minimum number of characters users can enter'
  },
  classes: GOVUK_INPUT_WIDTH_3
}

export const maxLength = {
  name: 'maxLength',
  id: 'maxLength',
  label: {
    text: 'Maximum character length (optional)',
    classes: GOVUK_LABEL__M
  },
  hint: {
    text: 'The maximum number of characters users can enter'
  },
  classes: GOVUK_INPUT_WIDTH_3
}

/** @type {GovukField} */
export const min = {
  name: 'min',
  id: 'min',
  label: {
    text: 'Lowest number users can enter (optional)',
    classes: GOVUK_LABEL__M
  },
  classes: GOVUK_INPUT_WIDTH_3
}

/** @type {GovukField} */
export const max = {
  name: 'max',
  id: 'max',
  label: {
    text: 'Highest number users can enter (optional)',
    classes: GOVUK_LABEL__M
  },
  classes: GOVUK_INPUT_WIDTH_3
}

/** @type {GovukField} */
export const classes = {
  name: 'classes',
  id: 'classes',
  label: {
    text: 'Classes (optional)',
    classes: GOVUK_LABEL__M
  },
  hint: {
    text: 'Apply CSS classes to this field. For example, ‘govuk-input govuk-!-width-full’'
  },
  rows: 1
}

/** @type {GovukField} */
export const regex = {
  name: 'regex',
  id: 'regex',
  label: {
    text: 'Regex (optional)',
    classes: GOVUK_LABEL__M
  },
  hint: {
    text: 'Specifies a regular expression to validate users’ inputs. Use JavaScript syntax'
  },
  rows: 3
}

/**
 * @import { ComponentDef, GovukField } from '@defra/forms-model'
 */
