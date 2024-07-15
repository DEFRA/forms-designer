import * as create from '~/src/models/forms/create.js'

/**
 * @param {string} slug
 * @param {Partial<FormMetadataInput>} [metadata]
 * @param {ValidationFailure} [validation]
 */
export function organisationViewModel(slug, metadata, validation) {
  return {
    ...create.organisationViewModel(metadata, validation),
    backLink: {
      href: `/library/${slug}`
    }
  }
}

/**
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 * @typedef {import("~/src/common/helpers/build-error-details.js").ValidationFailure<FormMetadataInput>} ValidationFailure
 * @typedef {import('~/src/common/helpers/build-error-details.js').ErrorDetails} ErrorDetails
 */
