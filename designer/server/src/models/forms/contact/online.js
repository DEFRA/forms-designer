import { buildErrorList } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataContactOnline>} [validation]
 */
export function onlineViewModel(metadata, validation) {
  const pageTitle = 'Contact link for support'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: {
      text: 'Back',
      href: `/library/${metadata.slug}`
    },
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
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataContactOnline } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
