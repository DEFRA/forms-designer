import { buildErrorList } from '~/src/common/helpers/build-error-details.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function phoneViewModel(metadata, validation) {
  const pageTitle = 'Phone number and opening times'
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
    field: {
      id: 'phone',
      name: 'phone',
      label: {
        text: 'What’s the phone number and opening times for users to get help?'
      },
      value: formValues?.contact?.phone ?? metadata.contact?.phone
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function emailViewModel(metadata, validation) {
  const pageTitle = 'Email address for support'
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
      address: {
        id: 'address',
        name: 'address',
        label: {
          text: 'Email address'
        },
        hint: {
          text: 'Enter a dedicated support team email address. Do not enter a named individual. For example, ‘support@defra.gov.uk’'
        },
        value:
          formValues?.contact?.email?.address ??
          metadata.contact?.email?.address
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
        value:
          formValues?.contact?.email?.responseTime ??
          metadata.contact?.email?.responseTime
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
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
        value: formValues?.contact?.online?.url ?? metadata.contact?.online?.url
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
        value:
          formValues?.contact?.online?.text ?? metadata.contact?.online?.text
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
