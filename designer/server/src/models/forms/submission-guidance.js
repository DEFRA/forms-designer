import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formOverviewBackLink } from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<Pick<FormMetadataInput, 'submissionGuidance'>>} [validation]
 */
export function submissionGuidanceViewModel(metadata, validation) {
  const pageTitle = 'Tell users what happens after they submit their form'
  const { formValues, formErrors } = validation ?? {}

  return {
    form: metadata,
    backLink: formOverviewBackLink(metadata.slug),
    pageTitle,
    errorList: buildErrorList(formErrors),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    field: {
      id: 'submissionGuidance',
      name: 'submissionGuidance',
      label: {
        text: 'What will happen after a user submits a form?'
      },
      value: formValues?.submissionGuidance ?? metadata.submissionGuidance
    },
    buttonText: 'Save and continue'
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
