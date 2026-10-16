import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataContact, 'phone'>>} [validation]
 */
export function phoneViewModel(metadata, validation) {
  const pageTitle = 'Phone number and opening times'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'phone',
      name: 'phone',
      label: {
        text: 'What’s the phone number and opening times for users to get help?'
      },
      value: formValues?.phone ?? metadata.contact?.phone
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

  return hasPhone && (!isLive || hasEmail || hasOnline)
}

/**
 * @import { FormMetadata, FormMetadataContact } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
