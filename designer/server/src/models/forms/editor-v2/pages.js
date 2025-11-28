import {
  ComponentType,
  ControllerType,
  FormStatus,
  hasComponents,
  hasComponentsEvenIfNoNext,
  isFormType,
  isSummaryPage
} from '@defra/forms-model'

import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { getPageConditionDetails } from '~/src/models/forms/editor-v2/condition-helpers.js'
import { buildPreviewUrl } from '~/src/models/forms/editor-v2/preview-helpers.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath
} from '~/src/models/links.js'

const BUTTON_SECONDARY_CLASS = 'govuk-button--secondary'

/**
 * @param {Page} page
 */
export function isGuidancePage(page) {
  const components = hasComponents(page) ? page.components : []
  return (
    components.length === 1 && components[0].type === ComponentType.Markdown
  )
}

/**
 * @param {Page} page
 * @param {boolean} isEndPage
 * @param {string} editBaseUrl
 */
export function determineEditUrl(page, isEndPage, editBaseUrl) {
  if (isEndPage) {
    return `${editBaseUrl}${page.id}/check-answers-settings`
  }

  if (isGuidancePage(page)) {
    const components = hasComponents(page) ? page.components : []
    return `${editBaseUrl}${page.id}/guidance/${components[0].id}`
  }

  return `${editBaseUrl}${page.id}/questions`
}

/**
 * @param {ComponentDef} component
 * @param {number} idx
 * @returns {GovukSummaryListRow}
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
 * @param {ConditionDetails} conditionDetails
 * @returns {GovukSummaryListRow}
 */
export function mapCondition(conditionDetails) {
  return {
    key: {
      text: 'Page shown when'
    },
    value: {
      html: `<ul class="govuk-list">
        <li class="govuk-!-margin-bottom-2" style="display: flex; align-items: flex-start;">
          <span class="govuk-checkboxes__tick green-tick">✓</span>
          <div>
            <span class="govuk-!-font-weight-bold">${conditionDetails.pageConditionDetails?.displayName}</span>
            <div class="govuk-!-margin-left-3 govuk-!-margin-top-1 with-ellipsis">${conditionDetails.pageConditionPresentationString}</div>
          </div>
        </li>
      </ul>`
    }
  }
}

/**
 * @param {MarkdownComponent} component
 * @param {boolean} isSummary
 * @returns {GovukSummaryListRow}
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
 * @param {FormDefinition} definition
 * @param {Page} page
 */
export function mapQuestionRows(definition, page) {
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const conditionDetails = getPageConditionDetails(
    definition,
    /** @type {string} */ (page.id)
  )

  const isSummary = isSummaryPage(page)

  const rows = components.map((comp, idx) =>
    comp.type === ComponentType.Markdown
      ? mapMarkdown(comp, isSummary)
      : mapQuestion(comp, idx)
  )

  if (
    components.length === 1 &&
    components[0].type !== ComponentType.Markdown
  ) {
    // Hide question if only one per page, and not a markdown (summary or guidance page)
    rows.shift()
  }

  if (conditionDetails.pageCondition) {
    rows.push(mapCondition(conditionDetails))
  }

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
 * @param { string[] | undefined } filterOptions
 */
export function mapPageData(slug, definition, filterOptions) {
  if (!definition.pages.length) {
    return definition
  }

  const editBaseUrl = `/library/${slug}/editor-v2/page/`

  return {
    ...definition,
    pages: definition.pages
      .filter(
        (p) =>
          !filterOptions?.length ||
          isSummaryPage(p) ||
          filterOptions.includes(p.condition ?? 'unknown')
      )
      .map((page) => {
        const isEndPage = isSummaryPage(page)
        const isExitPage = page.controller === ControllerType.Terminal
        const pageNum = definition.pages.findIndex((p) => p.id === page.id) + 1

        if (page.title === '') {
          return {
            ...page,
            pageNum,
            title: hasComponents(page) ? page.components[0].title : '',
            questionRows: mapQuestionRows(definition, hideFirstGuidance(page)),
            isEndPage,
            isExitPage,
            editUrl: determineEditUrl(page, isEndPage, editBaseUrl)
          }
        }
        return {
          ...page,
          pageNum,
          questionRows: mapQuestionRows(definition, hideFirstGuidance(page)),
          isEndPage,
          isExitPage,
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
  if (isSummaryPage(page)) {
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
 * Build initial page actions
 * @param {string} slug
 */
function buildPageActions(slug) {
  return [
    {
      text: 'Add new page',
      href: editorv2Path(slug, 'page'),
      classes: 'govuk-button--inverse',
      attributes: /** @type {string | null} */ (null)
    }
  ]
}

/**
 * Build reorder action
 * @param {string} slug
 */
function buildReorderAction(slug) {
  return {
    text: 'Re-order pages',
    href: editorv2Path(slug, 'pages-reorder'),
    classes: BUTTON_SECONDARY_CLASS,
    attributes: null
  }
}

/**
 * Build right side actions (manage conditions, upload/download)
 * @param {string} slug
 */
function buildRightSideActions(slug) {
  return [
    {
      text: 'Manage conditions',
      href: editorv2Path(slug, 'conditions'),
      classes: BUTTON_SECONDARY_CLASS,
      attributes: null
    },
    {
      text: 'Upload a form',
      href: editorv2Path(slug, 'upload'),
      classes: BUTTON_SECONDARY_CLASS,
      attributes: null
    },
    {
      text: 'Download this form',
      href: `/library/${slug}/editor-v2/download`,
      classes: BUTTON_SECONDARY_CLASS,
      attributes: null
    }
  ]
}

/**
 * Build conditions filter (left panel)
 * @param {FormDefinition} definition
 * @param { string[] } filter
 */
export function buildConditionsFilter(definition, filter) {
  const conditions = definition.conditions.sort((condA, condB) =>
    condA.displayName.localeCompare(condB.displayName)
  )

  // Find all condition ids that are assigned to at least one page
  const assignedConditionIds = new Set(
    definition.pages
      .filter(({ condition }) => condition !== undefined)
      .map((x) => x.condition)
      .filter(Boolean)
  )

  return {
    show: conditions.length > 0,
    rightPanelClass: conditions.length
      ? 'govuk-grid-column-three-quarters'
      : 'govuk-grid-column-full',
    applied: filter.map(
      (condId) =>
        conditions.find((c) => 'id' in c && c.id === condId)?.displayName
    ),
    available: {
      name: 'conditionsFilter',
      classes: 'govuk-checkboxes--small',
      items: conditions
        .map((cond) => {
          const valueStr = 'id' in cond ? cond.id : cond.name
          return assignedConditionIds.has(valueStr)
            ? {
                text: cond.displayName,
                value: valueStr,
                checked: filter.includes(valueStr)
              }
            : undefined
        })
        .filter(Boolean)
    },
    notAvailable: conditions
      .map((cond) => {
        const valueStr = 'id' in cond ? cond.id : cond.name
        return !assignedConditionIds.has(valueStr)
          ? cond.displayName
          : undefined
      })
      .filter(Boolean)
  }
}

/**
 * Add conditional actions based on page count
 * @param {Array<any>} pageActions
 * @param {number} numOfNonSummaryPages
 * @param {string} slug
 * @param {string} previewBaseUrl
 */
function addConditionalActions(
  pageActions,
  numOfNonSummaryPages,
  slug,
  previewBaseUrl
) {
  if (numOfNonSummaryPages > 1) {
    pageActions.push(buildReorderAction(slug))
  }

  if (numOfNonSummaryPages > 0) {
    pageActions.push({
      text: 'Preview form',
      href: previewBaseUrl,
      classes: 'govuk-link govuk-link--inverse',
      attributes: 'target="_blank"'
    })
  }
}

/**
 * Build page headings and titles
 * @param {FormMetadata} metadata
 */
function buildPageHeadings(metadata) {
  const pageHeading = 'Add and edit pages'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  return {
    pageHeading: { text: pageHeading },
    pageCaption: { text: pageCaption },
    pageTitle
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param { string[] } filter
 * @param {string[]} [notification]
 */
export function pagesViewModel(metadata, definition, filter, notification) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const previewBaseUrl = buildPreviewUrl(metadata.slug, FormStatus.Draft)

  const pageActions = buildPageActions(metadata.slug)
  const rightSideActions = buildRightSideActions(metadata.slug)
  const conditions = buildConditionsFilter(definition, filter)

  const numOfNonSummaryPages = definition.pages.filter(
    (x) => !isSummaryPage(x)
  ).length

  addConditionalActions(
    pageActions,
    numOfNonSummaryPages,
    metadata.slug,
    previewBaseUrl
  )

  const { pageHeading, pageCaption, pageTitle } = buildPageHeadings(metadata)
  const mappedData = mapPageData(metadata.slug, definition, filter)

  const pageListModel = {
    ...mappedData,
    pageTitle,
    formSlug: metadata.slug,
    previewBaseUrl,
    navigation,
    pageHeading,
    pageCaption,
    pageActions,
    rightSideActions,
    conditions,
    notification
  }

  return {
    ...pageListModel,
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @import { ComponentDef, ConditionDetails, GovukSummaryListRow, MarkdownComponent, FormMetadata, FormDefinition, Page } from '@defra/forms-model'
 */
