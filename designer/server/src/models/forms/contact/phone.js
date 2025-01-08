import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataContact, 'phone'>>} [validation]
 */
export function phoneViewModel(metadata, validation) {
  const pageTitle = 'Phone number and opening times'
  const backLink = formOverviewBackLink(metadata.slug)
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      caption: metadata.title,
      size: 'large'
    },
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'phone',
      name: 'phone',
      label: {
        text: 'What’s the phone number and opening times for users to get help?',
        classes: 'govuk-label--m',
        isPageHeading: false
      },
      type: 'tel',
      value: formValues?.phone ?? metadata.contact?.phone,
      autocomplete: 'tel'
    },
    buttons: [
      {
        text: 'Save and continue'
      },
      {
        text: 'Cancel',
        href: backLink.href,
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormMetadataContact } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
