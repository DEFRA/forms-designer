import {
  ConditionsModel,
  FormStatus,
  convertConditionWrapperFromV2,
  hasComponentsEvenIfNoNext,
  isConditionWrapperV2
} from '@defra/forms-model'

import {
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string} slug
 * @param {FormDefinition} definition
 */
export function buildConditionsTable(slug, definition) {
  const { pages, conditions, lists } = definition
  const editBaseUrl = `/library/${slug}/editor-v2/condition/`
  const components = pages.flatMap((page) =>
    hasComponentsEvenIfNoNext(page) ? page.components : []
  )

  /** @todo remove this filter when V1 is deprecated */
  const v2Conditions = conditions
    .filter(isConditionWrapperV2)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))

  /** @type {RuntimeFormModel} */
  const accessors = {
    getListById: (listId) => lists.find((list) => list.id === listId),
    getComponentById: (componentId) =>
      components.find((component) => component.id === componentId),
    getConditionById: (conditionId) =>
      v2Conditions.find((condition) => condition.name === conditionId)
  }

  return {
    firstCellIsHeader: false,
    classes: 'app-conditions-table',
    head: [{ text: 'Condition' }, { text: 'Used in' }, { text: 'Actions' }],
    rows: v2Conditions.map((condition) => {
      const conditionAsV1 = convertConditionWrapperFromV2(condition, accessors)
      const usedIn = pages
        .map((page, index) => ({ page, index }))
        .filter(({ page }) => page.condition === condition.name)
        .map(({ index }) => `Page ${index + 1}`)
        .join(', ')

      const linkClasses = 'govuk-link govuk-link--no-visited-state'
      const editLink = `<a class="${linkClasses}" href="${editBaseUrl}${condition.name}/edit">Edit</a>`
      const deleteLink = `<a class="${linkClasses}" href="${editBaseUrl}${condition.name}/delete">Delete</a>`

      return [
        {
          html: `<span class="govuk-!-font-weight-bold">${condition.displayName}</span><p>${ConditionsModel.from(conditionAsV1.value).toPresentationHtml()}</p>`
        },
        {
          text: usedIn
        },
        {
          html: `${editLink}&nbsp;<span class="app-vertical-divider">|</span>&nbsp;${deleteLink}`
        }
      ]
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string[]} [notification]
 */
export function conditionsViewModel(metadata, definition, notification) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )
  const previewBaseUrl = buildPreviewUrl(metadata.slug, FormStatus.Draft)
  const pageHeading = 'Manage conditions'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    cardTitle: 'All conditions',
    navigation,
    pageCaption: {
      text: pageCaption
    },
    notification,
    summaryTable: buildConditionsTable(metadata.slug, definition)
  }
}

/**
 * @import { FormMetadata, FormDefinition, RuntimeFormModel } from '@defra/forms-model'
 */
