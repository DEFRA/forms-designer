import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataContactOnline>} [validation]
 */
export function onlineViewModel(metadata, validation) {
  const pageTitle = 'Contact link for support'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    fields: {
      url: {
        id: 'url',
        name: 'url',
        label: {
          text: 'Contact link'
        },
        hint: {
          text: 'For example, ‘https://www.gov.uk/guidance/contact-defra’'
        },
        value: formValues?.url ?? metadata.contact?.online?.url
      },
      text: {
        id: 'text',
        name: 'text',
        label: {
          text: 'Text to describe the contact link'
        },
        hint: {
          text: 'For example, ‘Online contact form’'
        },
        value: formValues?.text ?? metadata.contact?.online?.text
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

  return hasOnline && (!isLive || hasPhone || hasEmail)
}

/**
 * @import { FormMetadata, FormMetadataContactOnline } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
