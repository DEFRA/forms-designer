import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import {
  constructReorderPage,
  excludeEndPages,
  orderPages
} from '~/src/models/forms/editor-v2/pages-helper.js'
import { formOverviewBackLink, formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormDefinition} definition
 * @param {string} pageOrder
 * @param {{ button: string | undefined, pageId: string | undefined} | undefined} focus
 */
export function mapPageData(definition, pageOrder, focus) {
  if (!definition.pages.length) {
    return definition
  }

  const orderablePages = excludeEndPages(definition.pages)

  const orderedPages = orderPages(orderablePages, pageOrder)

  return {
    ...definition,
    pages: orderedPages.map((page, idx) => {
      return constructReorderPage(page, idx, orderablePages.length, focus)
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageOrder
 * @param {{ button: string | undefined, pageId: string | undefined} | undefined} focus
 */
export function pagesReorderViewModel(metadata, definition, pageOrder, focus) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  const pageActions = [
    {
      name: 'saveChanges',
      text: 'Save changes',
      classes: 'govuk-button--inverse',
      value: 'true',
      type: 'submit'
    }
  ]

  const pageListModel = {
    ...mapPageData(definition, pageOrder, focus),
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
