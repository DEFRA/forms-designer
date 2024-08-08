import * as create from '~/src/models/forms/create.js'

const backLinkText = 'Back to form overview'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function organisationViewModel(metadata, validation) {
  return {
    ...create.organisationViewModel(metadata, validation),
    backLink: {
      text: backLinkText,
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @param {Pick<FormMetadata, 'teamName' | 'teamEmail' | 'slug'>} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
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
      text: backLinkText,
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @param {Pick<FormMetadata, 'title' | 'slug'>} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function titleViewModel(metadata, validation) {
  const titleModel = create.titleViewModel(metadata, validation)

  return {
    ...titleModel,
    backLink: {
      text: backLinkText,
      href: `/library/${metadata.slug}`
    }
  }
}

/**
 * @import { FormMetadata, FormMetadataInput } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
