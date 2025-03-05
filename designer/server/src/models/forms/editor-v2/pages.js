import {
  ComponentType,
  ControllerType,
  hasComponents,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import { ellipsise, nlToBr } from '~/src/lib/utils.js'
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
 * @param {Page} page
 */
export function mapQuestionRows(page) {
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []
  if (page.controller === ControllerType.Summary) {
    return components.map((comp) => ({
      key: {
        text: 'Declaration'
      },
      value: {
        html: nlToBr(
          comp.type === ComponentType.Html ? ellipsise(comp.content) : ''
        )
      }
    }))
  }

  return components.map((comp, idx) => ({
    key: {
      text: `Question ${idx + 1}`
    },
    value: {
      text:
        comp.options?.required === false
          ? `${comp.title} (optional)`
          : comp.title
    }
  }))
}

/**
 * @param {FormDefinition} definition
 */
export function mapPageData(definition) {
  if (!definition.pages.length) {
    return definition
  }

  return {
    ...definition,
    pages: definition.pages.map((page) => {
      if (page.title === '') {
        return {
          ...page,
          title: hasComponents(page) ? page.components[0].title : '',
          questionRows: mapQuestionRows(page)
        }
      }
      return {
        ...page,
        questionRows: mapQuestionRows(page)
      }
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string[]} [notification]
 */
export function pagesViewModel(metadata, definition, notification) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
  const previewBaseUrl = buildPreviewUrl(metadata.slug)
  const editBaseUrl = `/library/${metadata.slug}/editor-v2/page/`

  const pageActions = [
    {
      text: 'Add new page',
      href: editorv2Path(metadata.slug, 'page'),
      classes: 'govuk-button--inverse',
      attributes: /** @type {string | null} */ (null)
    }
  ]

  const reorderAction = {
    text: 'Re-order pages',
    href: '/reorder',
    classes: 'govuk-button--secondary',
    attributes: null
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
    ...mapPageData(definition),
    formSlug: metadata.slug,
    editBaseUrl,
    previewBaseUrl,
    navigation,
    pageHeading: {
      text: 'Add and edit pages'
    },
    pageCaption: {
      text: definition.name
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
