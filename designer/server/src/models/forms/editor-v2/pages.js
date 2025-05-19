import {
  ComponentType,
  ControllerType,
  FormStatus,
  hasComponents,
  hasComponentsEvenIfNoNext,
  isFormType
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
 * @param {Page} page
 * @param {boolean} isEndPage
 * @param {string} editBaseUrl
 */
export function determineEditUrl(page, isEndPage, editBaseUrl) {
  if (isEndPage) {
    return `${editBaseUrl}${page.id}/check-answers-settings`
  }

  const components = hasComponents(page) ? page.components : []
  if (
    components.length === 1 &&
    components[0].type === ComponentType.Markdown
  ) {
    return `${editBaseUrl}${page.id}/guidance/${components[0].id}`
  }

  return `${editBaseUrl}${page.id}/questions`
}

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
      text: isSummary ? 'Declaration' : 'Guidance'
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

  const rows = components.map((comp, idx) =>
    comp.type === ComponentType.Markdown
      ? mapMarkdown(comp, isSummary)
      : mapQuestion(comp, idx)
  )

  if (page.controller === ControllerType.Repeat) {
    rows.push({
      key: { text: 'People can answer' },
      value: { text: 'More than once' }
    })
  }

  return rows
}

/**
 * @param {string} slug
 * @param {FormDefinition} definition
 */
export function mapPageData(slug, definition) {
  if (!definition.pages.length) {
    return definition
  }

  const editBaseUrl = `/library/${slug}/editor-v2/page/`

  return {
    ...definition,
    pages: definition.pages.map((page) => {
      const isEndPage = page.controller === ControllerType.Summary
      if (page.title === '') {
        return {
          ...page,
          title: hasComponents(page) ? page.components[0].title : '',
          questionRows: mapQuestionRows(hideFirstGuidance(page)),
          isEndPage,
          editUrl: determineEditUrl(page, isEndPage, editBaseUrl)
        }
      }
      return {
        ...page,
        questionRows: mapQuestionRows(hideFirstGuidance(page)),
        isEndPage,
        editUrl: determineEditUrl(page, isEndPage, editBaseUrl)
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

  const components = hasComponents(page) ? page.components : []

  // Don't hide a guidance component if it's the only component on the page
  if (
    components.length === 1 &&
    components[0].type === ComponentType.Markdown
  ) {
    return page
  }

  return {
    ...page,
    components: components.filter((c) => isFormType(c.type))
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
  const previewBaseUrl = buildPreviewUrl(metadata.slug, FormStatus.Draft)

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
    href: editorv2Path(metadata.slug, 'pages-reorder'),
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

  const pageHeading = 'Add and edit pages'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`
  const pageListModel = {
    ...mapPageData(metadata.slug, definition),
    pageTitle,
    formSlug: metadata.slug,
    previewBaseUrl,
    navigation,
    pageHeading: {
      text: pageHeading
    },
    pageCaption: {
      text: pageCaption
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
