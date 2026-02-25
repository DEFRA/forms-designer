import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
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
        items: [
          {
            value: 'true',
            text: 'I agree to the data protection terms and conditions',
            checked: metadata.termsAndConditionsAgreed === true
          }
        ],
        ...insertValidationErrors(formErrors?.termsAndConditionsAgreed)
      }
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
