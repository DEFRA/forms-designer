import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import {
  constructPage,
  excludeEndPages,
  orderPages
} from '~/src/models/forms/editor-v2/pages-helper.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath
} from '~/src/models/links.js'

/**
 * @param {FormDefinition} definition
 * @param {string} pageOrder
 */
export function mapPageData(definition, pageOrder) {
  if (!definition.pages.length) {
    return definition
  }

  const orderablePages = excludeEndPages(definition.pages)

  const orderedPages = orderPages(orderablePages, pageOrder)

  return {
    ...definition,
    pages: orderedPages.map((page, idx) => {
      return constructPage(page, idx, orderablePages.length)
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageOrder
 */
export function pagesReorderViewModel(metadata, definition, pageOrder) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  const pageActions = [
    {
      text: 'Save changes',
      href: editorv2Path(metadata.slug, 'pages-reorder'),
      classes: 'govuk-button--inverse'
    }
  ]

  const pageListModel = {
    ...mapPageData(definition, pageOrder),
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
    pageOrder
  }

  return {
    ...pageListModel,
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @import { FormMetadata, FormDefinition, Page } from '@defra/forms-model'
 */
