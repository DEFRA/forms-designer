import * as create from './create.js'

/**
 * @param {string} slug
 * @param {ValidationFailure} [validation]
 */
export function organisationViewModel(slug, validation) {
  const createView = create.organisationViewModel(undefined, validation)

  createView.backLink.href = `/library/${slug}`

  return createView
}

/**
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 * @typedef {import("~/src/common/helpers/build-error-details.js").ValidationFailure<FormMetadataInput>} ValidationFailure
 * @typedef {import('~/src/common/helpers/build-error-details.js').ErrorDetails} ErrorDetails
 */
