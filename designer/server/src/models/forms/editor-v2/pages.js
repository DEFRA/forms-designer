import {
  ComponentType,
  ControllerType,
  FormStatus,
  hasComponents,
  hasComponentsEvenIfNoNext,
  isEndPage as isAnEndPage,
  isFormType,
  isPaymentPage,
  isSummaryPage
} from '@defra/forms-model'

import {
  getFormSpecificNavigation,
  getSectionForPage
} from '~/src/models/forms/editor-v2/common.js'
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
 * @param {boolean} isSummary
 * @param {string} editBaseUrl
 */
export function determineEditUrl(page, isSummary, editBaseUrl) {
  if (isSummary) {
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

  const isPayment = isPaymentPage(page)
  if (isPayment) {
    const paymentComponent = components.find(
      (comp) => comp.type === ComponentType.PaymentField
    )
    return [
      {
        key: { text: 'Payment for' },
        value: { text: paymentComponent?.options.description }
      },
      {
        key: { text: 'Total amount' },
        value: { text: `£${paymentComponent?.options.amount.toFixed(2)}` }
      }
    ]
  }

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
 * @param {Page} page
 * @returns {string}
 */
export function mapTitle(page) {
  if (isSummaryPage(page)) {
    return 'Check your answers'
  }
  if (isPaymentPage(page)) {
    return 'Payment'
  }
  if (page.title === '') {
    return hasComponents(page) ? page.components[0].title : ''
  }
  return page.title
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
          filterOptions.includes(p.condition ?? 'unknown') ||
          isAnEndPage(p)
      )
      .map((page) => {
        const isEndPage = isAnEndPage(page)
        const isSummary = isSummaryPage(page)
        const isExitPage = page.controller === ControllerType.Terminal
        const pageNum = definition.pages.findIndex((p) => p.id === page.id) + 1
        const sectionInfo = getSectionForPage(definition, page, slug)

        return {
          ...page,
          title: mapTitle(page),
          pageNum,
          questionRows: mapQuestionRows(definition, hideFirstGuidance(page)),
          isEndPage,
          isExitPage,
          editUrl: determineEditUrl(page, isSummary, editBaseUrl),
          sectionInfo
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
 * @param {number} numOfNonEndPages
 * @param {string} slug
 * @param {string} previewBaseUrl
 */
function addConditionalActions(
  pageActions,
  numOfNonEndPages,
  slug,
  previewBaseUrl
) {
  if (numOfNonEndPages > 1) {
    pageActions.push(buildReorderAction(slug))
  }

  if (numOfNonEndPages > 0) {
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

  const numOfNonEndPages = definition.pages.filter(
    (x) => !isAnEndPage(x)
  ).length

  addConditionalActions(
    pageActions,
    numOfNonEndPages,
    metadata.slug,
    previewBaseUrl
  )

  const { pageHeading, pageCaption, pageTitle } = buildPageHeadings(metadata)
  const mappedData = mapPageData(metadata.slug, definition, filter)

  // @ts-expect-error - dynamic property on page
  const standardPages = mappedData.pages.filter((page) => !page.isEndPage)
  // @ts-expect-error - dynamic property on page
  const endPages = mappedData.pages.filter((page) => page.isEndPage)

  const pageListModel = {
    standardPages,
    endPages,
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
