import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<{ termsAndConditionsAgreed: string }> | undefined} [validation]
 */
export function termsAndConditionsViewModel(metadata, validation) {
  const pageTitle = 'Terms and conditions'
  const { formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors,
    fields: {
      termsAndConditionsAgreed: {
        id: 'termsAndConditionsAgreed',
        name: 'termsAndConditionsAgreed',
        value: 'true',
        checked: metadata.termsAndConditionsAgreed === true
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
