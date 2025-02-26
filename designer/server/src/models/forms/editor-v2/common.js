import { ControllerType } from '@defra/forms-model'

import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import { editorv2Path, formsLibraryPath } from '~/src/models/links.js'

export const BACK_TO_ADD_AND_EDIT_PAGES = 'Back to add and edit pages'
export const SAVE_AND_CONTINUE = 'Save and continue'
export const GOVUK_LABEL__M = 'govuk-label--m'
export const CHANGES_SAVED_SUCCESSFULLY = 'Changes saved successfully'

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 */
export function getPageNum(definition, pageId) {
  if (pageId === 'new') {
    return (
      definition.pages.filter((x) => x.controller !== ControllerType.Summary)
        .length + 1
    )
  }
  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  return pageIdx + 1
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
    ['Editor', `${formPath}/editor-v2/pages`]
  ]

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @param {string} slug
 * @param {string} pageTitle
 */
export function baseModelFields(slug, pageTitle) {
  return {
    backLink: {
      href: editorv2Path(slug, 'pages'),
      text: BACK_TO_ADD_AND_EDIT_PAGES
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    useNewMasthead: true
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
