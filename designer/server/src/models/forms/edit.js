import * as create from '~/src/models/forms/create.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure} [validation]
 */
export function organisationViewModel(metadata, validation) {
  return {
    ...create.organisationViewModel(metadata, validation),
    backLink: {
      text: 'Back to form overview',
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure} [validation]
 */
export function teamNameViewModel(metadata, validation) {
  return {
    ...create.teamViewModel(metadata, validation),
    backLink: {
      text: 'Back to form overview',
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 * @typedef {import("~/src/common/helpers/build-error-details.js").ValidationFailure<FormMetadataInput>} ValidationFailure
 * @typedef {import('~/src/common/helpers/build-error-details.js').ErrorDetails} ErrorDetails
 */
