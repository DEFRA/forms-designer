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
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: {
      address: {
        id: 'address',
        name: 'address',
        label: {
          text: 'Email address'
        },
        hint: {
          text: 'Enter a dedicated support team email address. Do not enter a named individual. For example, ‘support@defra.gov.uk’'
        },
        value: formValues?.address ?? metadata.contact?.email?.address
      },
      responseTime: {
        id: 'responseTime',
        name: 'responseTime',
        label: {
          text: 'Response time'
        },
        hint: {
          text: 'Enter how long it takes to receive a response, for example, ‘We aim to respond within 2 working days’'
        },
        value: formValues?.responseTime ?? metadata.contact?.email?.responseTime
      }
    },
    buttonText: 'Save and continue',
    allowDelete: allowDelete(metadata)
  }
}

/**
 * @param {FormMetadata} metadata
 */
export function allowDelete(metadata) {
  const isLive = !!metadata.live
  const hasPhone = !!metadata.contact?.phone
  const hasEmail = !!metadata.contact?.email
  const hasOnline = !!metadata.contact?.online

  return hasEmail && (!isLive || hasPhone || hasOnline)
}

/**
 * @import { FormMetadata, FormMetadataContactEmail } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
