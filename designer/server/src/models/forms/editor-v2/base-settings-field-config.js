import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

/**
 * @type {FormEditorGovukFieldBase}
 */
export const allBaseSettingsFields = {
  question: {
    name: 'question',
    id: 'question',
    label: {
      text: 'Question',
      classes: GOVUK_LABEL__M
    }
  },
  hintText: {
    name: 'hintText',
    id: 'hintText',
    label: {
      text: 'Hint text (optional)',
      classes: GOVUK_LABEL__M
    },
    rows: 3
  },
  questionOptional: {
    name: 'questionOptional',
    id: 'questionOptional',
    classes: 'govuk-checkboxes--small',
    formGroup: { classes: 'app-settings-checkboxes' },
    items: [
      {
        value: 'true',
        text: 'Make this question optional',
        checked: false
      }
    ]
  },
  shortDescription: {
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
  },
  fileTypes: {
    id: 'fileTypes',
    name: 'fileTypes',
    idPrefix: 'fileTypes',
    fieldset: {
      legend: {
        text: 'Select the file types you accept',
        isPageHeading: false,
        classes: 'govuk-fieldset__legend--m'
      }
    },
    customTemplate: 'file-types'
  },
  documentTypes: {
    id: 'documentTypes',
    name: 'documentTypes',
    idPrefix: 'documentTypes'
  },
  imageTypes: {
    id: 'imageTypes',
    name: 'imageTypes',
    idPrefix: 'imageTypes'
  },
  tabularDataTypes: {
    id: 'tabularDataTypes',
    name: 'tabularDataTypes',
    idPrefix: 'tabularDataTypes'
  },
  radiosOrCheckboxes: {
    id: 'radiosOrCheckboxes',
    name: 'radiosOrCheckboxes',
    customTemplate: 'radios-or-checkboxes'
  },
  autoCompleteOptions: {
    id: 'autoCompleteOptions',
    name: 'autoCompleteOptions',
    idPrefix: 'autoCompleteOptions',
    label: {
      text: 'Add each option on a new line',
      classes: 'govuk-label--s',
      isPageHeading: false
    },
    hint: {
      text: 'To optionally set an input value for each item, separate the option text and value with a colon (e.g English:en-gb)'
    },
    customTemplate: 'auto-complete-options'
  },
  declarationText: {
    id: 'declarationText',
    name: 'declarationText',
    idPrefix: 'declarationText',
    label: {
      text: 'Declaration text',
      classes: 'govuk-label--m'
    },
    hint: {
      text: 'You can use Markdown if you want to format the content or add links'
    },
    preContent: {
      path: '../../../../views/forms/editor-v2/partials/help-writing-declaration.njk'
    },
    postContent: {
      path: '../../../../views/forms/editor-v2/partials/markdown-help.njk'
    }
  },
  usePostcodeLookup: {
    name: 'usePostcodeLookup',
    id: 'usePostcodeLookup',
    classes: 'govuk-checkboxes--small',
    formGroup: { classes: 'app-settings-checkboxes' },
    items: [
      {
        value: 'true',
        text: 'Use postcode lookup',
        checked: false,
        hint: {
          text: 'Allow users to search for an address using a postcode'
        }
      }
    ]
  },
  paymentAmount: {
    id: 'paymentAmount',
    name: 'paymentAmount',
    idPrefix: 'paymentAmount',
    prefix: {
      text: '£'
    },
    label: {
      text: 'Payment amount',
      classes: GOVUK_LABEL__M
    },
    classes: 'govuk-input--width-5'
  },
  paymentDescription: {
    id: 'paymentDescription',
    name: 'paymentDescription',
    idPrefix: 'paymentDescription',
    label: {
      text: 'Payment description',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: "Tell users what the payment is for, for example, 'Processing fees for your application'"
    }
  },
  paymentTestApiKey: {
    id: 'paymentTestApiKey',
    name: 'paymentTestApiKey',
    idPrefix: 'paymentTestApiKey',
    label: {
      text: 'Test API key for the draft form and live previews',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Use a test API key from your GOV.UK Pay test account. This is used while your form is in draft or if you are previewing a live form'
    },
    customTemplate: 'payment-test-api-key'
  },
  paymentLiveApiKey: {
    id: 'paymentLiveApiKey',
    name: 'paymentLiveApiKey',
    idPrefix: 'paymentLiveApiKey',
    label: {
      text: 'Live API key',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Make sure your live API key has been tested and can take real payments'
    },
    customTemplate: 'payment-live-api-key'
  }
}

/**
 * @import { FormEditorGovukFieldBase } from '@defra/forms-model'
 */
