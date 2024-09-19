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
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataContact } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
