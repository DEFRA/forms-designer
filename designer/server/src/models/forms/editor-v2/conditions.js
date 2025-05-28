import { ConditionsModel, FormStatus } from '@defra/forms-model'

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
  const { pages, conditions } = definition
  const editBaseUrl = `/library/${slug}/editor-v2/condition/`

  return {
    firstCellIsHeader: false,
    classes: 'app-conditions-table',
    head: [{ text: 'Condition' }, { text: 'Used in' }, { text: 'Actions' }],
    rows: conditions.map((condition) => {
      return [
        {
          html: `<strong>${condition.displayName}</strong><p>${ConditionsModel.from(condition.value).toPresentationString()}</p>`
        },
        {
          text: pages
            .map((page, index) => ({ page, index }))
            .filter(({ page }) => page.condition)
            .map(({ index }) => `Page ${index + 1}`)
            .join(', ')
        },
        {
          html: `<a class="govuk-link govuk-link--no-visited-state" href="${editBaseUrl}${condition.id}/edit">Edit</a>&nbsp;<span class="app-vertical-divider">|</span>&nbsp;<a class="govuk-link govuk-link--no-visited-state" href="${editBaseUrl}${condition.id}/delete">Delete</a>`
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
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')
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
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
