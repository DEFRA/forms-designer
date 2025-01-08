import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataInput, 'notificationEmail'>>} [validation]
 */
export function notificationEmailViewModel(metadata, validation) {
  const pageTitle = 'Email address for submitted forms'
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
    field: {
      id: 'notificationEmail',
      name: 'notificationEmail',
      label: {
        text: 'What email address should submitted forms be sent to?'
      },
      value: formValues?.notificationEmail ?? metadata.notificationEmail,
      hint: {
        text: 'Used to send submitted forms for processing. Emails must end with ‘.gov.uk’ or ‘.org.uk’, like name@example.gov.uk or name@example.org.uk'
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
