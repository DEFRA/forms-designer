import * as create from '~/src/models/forms/create.js'
import { formOverviewBackLink, formOverviewPath } from '~/src/models/links.js'
import { getFormSpecificNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

/**
 * @param {FormMetadata} metadata
 * @param {ValidationFailure<FormMetadataInput>} [validation]
 */
export function organisationViewModel(metadata, validation) {
  return {
    ...create.organisationViewModel(metadata, validation),
    backLink: formOverviewBackLink(metadata.slug)
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
    backLink: formOverviewBackLink(metadata.slug)
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
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function pageListViewModel(metadata, definition) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  const pageListModel = {
    ...definition,
    navigation,
    pageHeading: {
      text: 'Add and edit pages'
    },
    pageDescription: {
      text: definition.name
    },
    pageActions: [
      {
        text: 'Add new page',
        href: '/add',
        classes: 'govuk-button--inverse'
      },
      {
        text: 'Re-order pages',
        href: '/reorder',
        classes: 'govuk-button--secondary'
      },
      {
        text: 'Preview form',
        href: '/preview',
        classes: 'govuk-link govuk-link--inverse'
      }
    ]
  }

  return {
    ...pageListModel,
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @import { FormMetadata, FormMetadataInput, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
