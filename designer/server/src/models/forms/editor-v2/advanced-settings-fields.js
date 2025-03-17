import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

/**
 * @type { Record<string, GovukField> }
 */
export const allAdvancedSettingsFields =
  /** @type { Record<string, GovukField> } */ ({
    [QuestionAdvancedSettings.MinLength]: {
      name: 'minLength',
      id: 'minLength',
      label: {
        text: 'Minimum character length (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The minimum number of characters users can enter'
      },
      classes: 'govuk-input--width-3'
    },
    [QuestionAdvancedSettings.MaxLength]: {
      name: 'maxLength',
      id: 'maxLength',
      label: {
        text: 'Maximum character length (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The maximum number of characters users can enter'
      },
      classes: 'govuk-input--width-3'
    },
    [QuestionAdvancedSettings.Regex]: {
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
    },
    [QuestionAdvancedSettings.Classes]: {
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
  })

/**
 * @import { GovukField } from '@defra/forms-model'
 */
