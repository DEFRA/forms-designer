import { ControllerType } from '@defra/forms-model'

import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { handlePageTitle } from '~/src/models/forms/editor-v2/pages-helper.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath
} from '~/src/models/links.js'

/**
 * @param {Page} page
 * @param {number} pageIdx
 * @param {number} numOfPages
 * @param {string} baseUrl
 */
export function addActionsToPageElement(page, pageIdx, numOfPages, baseUrl) {
  const actions = []
  if (pageIdx > 0) {
    actions.push({
      href: `${baseUrl}/${page.id}`,
      text: 'Up',
      visuallyHiddenText: ` page ${pageIdx + 1}`,
      classes: 'govuk-button govuk-button--secondary'
    })
  }

  if (pageIdx < numOfPages - 1) {
    actions.push({
      href: `${baseUrl}/${page.id}`,
      text: 'Down',
      visuallyHiddenText: ` page ${pageIdx + 1}`,
      classes: 'govuk-button govuk-button--secondary'
    })
  }

  return actions
}

/**
 * @param {FormDefinition} definition
 * @param {string} baseUrl
 */
export function mapPageData(definition, baseUrl) {
  if (!definition.pages.length) {
    return definition
  }

  const orderablePages = definition.pages.filter(
    (page) => page.controller !== ControllerType.Summary
  )

  return {
    ...definition,
    pages: orderablePages.map((page, idx) => {
      return addActionsToPageElement(
        handlePageTitle(page),
        idx,
        orderablePages.length,
        baseUrl
      )
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string[]} [notification]
 * @param {string[]} [pageOrder]
 */
export function pagesReorderViewModel(
  metadata,
  definition,
  notification,
  pageOrder
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const reorderBaseUrl = `/library/${metadata.slug}/editor-v2/page/${pageOrder ? pageOrder[0] : ''}`

  const pageActions = [
    {
      text: 'Save changes',
      href: editorv2Path(metadata.slug, 'pages-reorder'),
      classes: 'govuk-button--inverse'
    }
  ]

  const pageListModel = {
    ...mapPageData(definition, reorderBaseUrl),
    formSlug: metadata.slug,
    navigation,
    pageHeading: {
      text: 'Re-order pages'
    },
    pageCaption: {
      text: definition.name
    },
    pageDescription: {
      text: 'Use the up and down buttons or drag and drop pages to re-order them.'
    },
    pageActions,
    notification
  }

  return {
    ...pageListModel,
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @import { FormMetadata, FormDefinition, Page } from '@defra/forms-model'
 */
