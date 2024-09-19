import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataInput, 'privacyNoticeUrl'>>} [validation]
 */
export function privacyNoticyViewModel(metadata, validation) {
  const pageTitle = 'Privacy notice for this form'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'privacyNoticeUrl',
      name: 'privacyNoticeUrl',
      label: {
        text: 'Link to privacy notice for this form'
      },
      value: formValues?.privacyNoticeUrl ?? metadata.privacyNoticeUrl,
      hint: {
        text: 'For example, https://www.gov.uk/help/privacy-notice'
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
