import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import * as create from '~/src/models/forms/create.js'
import {
  formOverviewBackLink,
  formOverviewPath,
  formsLibraryPath
} from '~/src/models/links.js'

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
 * Returns the navigation bar items as an array. Where activePage matches
 * a page, that page will have isActive:true set.
 * @param {string} formPath
 * @param {FormMetadata} metadata
 * @param {string} activePage
 */
export function getFormSpecificNavigation(formPath, metadata, activePage = '') {
  const navigationItems = [
    ['Forms library', formsLibraryPath],
    ['Overview', formPath]
  ]

  if (metadata.draft) {
    navigationItems.push(['Editor', `${formPath}/editor`])
  }

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @import { FormMetadata, FormMetadataInput, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
