import { ControllerType, hasComponents } from '@defra/forms-model'

import {
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath
} from '~/src/models/links.js'

/**
 * @param {FormDefinition} definition
 */
export function setPageHeadings(definition) {
  if (!definition.pages.length) {
    return definition
  }

  return {
    ...definition,
    pages: definition.pages.map((page) => {
      if (page.title === '') {
        return {
          ...page,
          title: hasComponents(page) ? page.components[0].title : ''
        }
      }
      return {
        ...page
      }
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function pagesViewModel(metadata, definition) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const previewBaseUrl = buildPreviewUrl(metadata.slug)

  const pageActions = [
    {
      text: 'Add new page',
      href: editorv2Path(metadata.slug, 'page'),
      classes: 'govuk-button--inverse',
      attributes: /** @type {string | undefined} */ (undefined)
    }
  ]

  const reorderAction = {
    text: 'Re-order pages',
    href: '/reorder',
    classes: 'govuk-button--secondary',
    attributes: undefined
  }

  const numOfNonSummaryPages = definition.pages.filter(
    (x) => x.controller !== ControllerType.Summary
  ).length

  if (numOfNonSummaryPages > 1) {
    pageActions.push(reorderAction)
  }

  if (numOfNonSummaryPages > 0) {
    pageActions.push({
      text: 'Preview form',
      href: previewBaseUrl,
      classes: 'govuk-link govuk-link--inverse',
      attributes: 'target="_blank"'
    })
  }

  const pageListModel = {
    ...setPageHeadings(definition),
    formSlug: metadata.slug,
    previewBaseUrl,
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
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
