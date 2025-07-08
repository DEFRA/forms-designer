import { FormStatus, isConditionWrapperV2 } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import {
  baseModelFields,
  buildPreviewUrl,
  getFormSpecificNavigation,
  toPresentationHtmlV2
} from '~/src/models/forms/editor-v2/common.js'
import { withPageNumbers } from '~/src/models/forms/editor-v2/pages-helper.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {string} id
 * @param {string} label
 * @param {string} value
 * @param {string} extraClasses?
 */
export function buildCheckbox(id, label, value, extraClasses = '') {
  const xClasses = extraClasses !== '' ? ` ${extraClasses}` : ''
  const valueElem = value !== '' ? `value="${value}"` : ''
  return `<div class="govuk-checkboxes__item govuk-checkboxes--small${xClasses}">
    <input type="checkbox" class="govuk-checkboxes__input" id="${id}" name="${id}" ${valueElem}></input>
    <label class="govuk-label govuk-checkboxes__label" for="${id}">
      <span class="govuk-visually-hidden">${label}</span>
    </label>
    </div>`
}

/**
 * @param {string} slug
 * @param {FormDefinition} definition
 */
export function buildConditionsTable(slug, definition) {
  const { pages, conditions } = definition
  const editBaseUrl = `/library/${slug}/editor-v2/condition/`

  /** @todo remove this filter when V1 is deprecated */
  const v2Conditions = conditions
    .filter(isConditionWrapperV2)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))

  return {
    firstCellIsHeader: false,
    classes: 'app-conditions-table',
    attributes: 'data-module="multi-select-table"',
    head: [
      {
        html: buildCheckbox(
          'multiSelectCondition-checkboxes-all',
          'Select all',
          '',
          'govuk-visually-hidden'
        )
      },
      { text: 'Condition' },
      { text: 'Used in' },
      { text: 'Actions' }
    ],
    rows: v2Conditions.map((condition, idx) => {
      const usedIn = pages
        .map(withPageNumbers)
        .filter(({ page }) => page.condition === condition.id)
        .map(({ number }) => `Page ${number}`)
        .join(', ')

      const linkClasses = 'govuk-link govuk-link--no-visited-state'
      const editLink = `<a class="${linkClasses}" href="${editBaseUrl}${condition.id}">Edit</a>`
      const deleteLink = `<a class="${linkClasses}" href="${editBaseUrl}${condition.id}/delete">Delete</a>`

      return [
        {
          html: buildCheckbox(
            `multiSelectCondition[${idx}]`,
            `Select ${condition.displayName}`,
            condition.id
          )
        },
        {
          html: `<span class="govuk-!-font-weight-bold">${condition.displayName}</span><p>${toPresentationHtmlV2(condition, definition)}</p>`
        },
        {
          text: usedIn,
          classes: 'govuk-!-width-one-quarter'
        },
        {
          html: `<div class="app-table-actions">${editLink}&nbsp;<span class="app-vertical-divider">|</span>&nbsp;${deleteLink}</div>`
        }
      ]
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {ValidationFailure<any>} [validation]
 * @param {string[]} [notification]
 */
export function conditionsViewModel(
  metadata,
  definition,
  validation,
  notification
) {
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
  const errorList = buildErrorList(validation?.formErrors)

  return {
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    formSlug: metadata.slug,
    previewBaseUrl,
    cardTitle: 'All conditions',
    navigation,
    pageCaption: {
      text: pageCaption
    },
    errorList,
    notification,
    summaryTable: buildConditionsTable(metadata.slug, definition)
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
