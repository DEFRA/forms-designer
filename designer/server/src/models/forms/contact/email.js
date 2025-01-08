import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataContactEmail>} [validation]
 */
export function emailViewModel(metadata, validation) {
  const pageTitle = 'Email address for support'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: metadata.title,
      size: 'large'
    },
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: [
      {
        id: 'address',
        name: 'address',
        label: {
          text: 'Email address',
          isPageHeading: false
        },
        hint: {
          text: 'Enter a dedicated support team email address. Do not enter a named individual. For example, ‘support@defra.gov.uk’'
        },
        type: 'email',
        value: formValues?.address ?? metadata.contact?.email?.address,
        autocomplete: 'email',
        spellcheck: false
      },
      {
        id: 'responseTime',
        name: 'responseTime',
        label: {
          text: 'Response time',
          isPageHeading: false
        },
        hint: {
          text: 'Enter how long it takes to receive a response, for example, ‘We aim to respond within 2 working days’'
        },
        value: formValues?.responseTime ?? metadata.contact?.email?.responseTime
      }
    ],
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataContactEmail } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
