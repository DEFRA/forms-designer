import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  formOverviewBackLink,
  formOverviewPath,
  formsLibraryPath
} from '~/src/models/links.js'

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function pageListViewModel(metadata, definition) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  const pageActions = [
    {
      text: 'Add new page',
      href: '/add',
      classes: 'govuk-button--inverse'
    }
  ]

  const extraPageActions = [
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

  if (definition.pages.length > 1) {
    pageActions.push(...extraPageActions)
  }

  const pageListModel = {
    ...definition,
    navigation,
    pageHeading: {
      text: 'Add and edit pages'
    },
    pageCaption: {
      text: definition.name
    },
    pageActions
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
 * @param {FormMetadata} _metadata
 * @param {string} activePage
 */
export function getFormSpecificNavigation(
  formPath,
  _metadata,
  activePage = ''
) {
  const navigationItems = [
    ['Forms library', formsLibraryPath],
    ['Overview', formPath],
    ['Editor', `${formPath}/editor-v2`]
  ]

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
