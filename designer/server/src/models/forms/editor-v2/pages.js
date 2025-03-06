import {
  ComponentType,
  ControllerType,
  hasComponents,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

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
 * @param {ComponentDef} component
 * @param {number} idx
 */
export function mapQuestion(component, idx) {
  return {
    key: {
      text: `Question ${idx + 1}`
    },
    value: {
      text:
        component.options?.required === false
          ? `${component.title} (optional)`
          : component.title
    }
  }
}

/**
 * @param {MarkdownComponent} component
 * @param {boolean} isSummary
 */
export function mapMarkdown(component, isSummary) {
  return {
    key: {
      text: isSummary ? 'Declaration' : 'Markdown'
    },
    value: {
      html: `<pre class="break-on-newlines"><p class="govuk-body">${component.content}</p></pre>`,
      classes: 'with-ellipsis'
    }
  }
}

/**
 * @param {Page} page
 */
export function mapQuestionRows(page) {
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const isSummary = page.controller === ControllerType.Summary

  return components.map((comp, idx) =>
    comp.type === ComponentType.Markdown
      ? mapMarkdown(comp, isSummary)
      : mapQuestion(comp, idx)
  )
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
          title: hasComponentsEvenIfNoNext(page)
            ? page.components[0].title
            : '',
          questionRows: mapQuestionRows(hideFirstGuidance(page))
        }
      }
      return {
        ...page,
        questionRows: mapQuestionRows(hideFirstGuidance(page))
      }
    })
  }
}

/**
 * Since the page setting of 'guidance' is shown at page level,
 * we don't want to list the guidance component as one of the page's questions
 * @param {Page} page
 */
export function hideFirstGuidance(page) {
  if (page.controller === ControllerType.Summary) {
    return page
  }

  return {
    ...page,
    components: hasComponents(page)
      ? page.components.filter(
          (comp, idx) => !(comp.type === ComponentType.Markdown && idx === 0)
        )
      : []
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
 * @import { ComponentDef, MarkdownComponent, FormMetadata, FormDefinition, Page } from '@defra/forms-model'
 */
