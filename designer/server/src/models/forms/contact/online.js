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
        id: 'url',
        name: 'url',
        label: {
          text: 'Contact link',
          isPageHeading: false
        },
        hint: {
          text: 'For example, ‘https://www.gov.uk/guidance/contact-defra’'
        },
        value: formValues?.url ?? metadata.contact?.online?.url
      },
      {
        id: 'text',
        name: 'text',
        label: {
          text: 'Text to describe the contact link',
          isPageHeading: false
        },
        hint: {
          text: 'For example, ‘Online contact form’'
        },
        value: formValues?.text ?? metadata.contact?.online?.text
      }
    ],
    buttons: [
      {
        text: 'Save and continue'
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormMetadataContactOnline } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
