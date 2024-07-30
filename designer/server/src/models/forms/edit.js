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
 * @param {Pick<FormMetadata, 'teamName' | 'teamEmail' | 'slug'>} metadata
 * @param {ValidationFailure} [validation]
 */
export function teamDetailsViewModel(metadata, validation) {
  const teamModel = create.teamViewModel(metadata, validation)

  const nameAndEmailfields = teamModel.fields.filter(
    (field) => field.id && ['teamName', 'teamEmail'].includes(field.id)
  )

  const teamDetailsModel = { ...teamModel, fields: nameAndEmailfields }
  return {
    ...teamDetailsModel,
    backLink: {
      text: 'Back to form overview',
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @param {Pick<FormMetadata, 'title' | 'slug'>} metadata
 * @param {ValidationFailure} [validation]
 */
export function titleViewModel(metadata, validation) {
  const teamModel = create.titleViewModel(metadata, validation)

  return {
    ...teamModel,
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
