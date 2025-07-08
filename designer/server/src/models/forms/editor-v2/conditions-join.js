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
    head: [{ text: 'Condition' }, { text: 'Used in' }, { text: 'Actions' }],
    rows: v2Conditions.map((condition) => {
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
export function conditionsJoinViewModel(
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
