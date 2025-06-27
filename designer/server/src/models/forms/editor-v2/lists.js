import { getPageTitle } from '@defra/forms-model'

import {
  getFormSpecificNavigation,
  getQuestionsOnPage
} from '~/src/models/forms/editor-v2/common.js'
import {
  editorv2Path,
  formOverviewBackLink,
  formOverviewPath
} from '~/src/models/links.js'

/**
 * Build page headings and titles
 * @param {FormMetadata} metadata
 */
function buildHeadings(metadata) {
  const pageHeading = 'Add and edit lists'
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  return {
    pageHeading: { text: pageHeading },
    pageCaption: { text: pageCaption },
    pageTitle
  }
}

/**
 * Build initial actions
 * @param {string} slug
 */
function buildActions(slug) {
  return [
    {
      text: 'Add new list',
      href: editorv2Path(slug, 'list/new'),
      classes: 'govuk-button--inverse',
      attributes: /** @type {string | null} */ (null)
    }
  ]
}

/**
 * @param {FormDefinition} definition
 * @param {List} list
 */
export function whereListUsed(definition, list) {
  const usedIn = []
  for (const page of definition.pages) {
    const questions = getQuestionsOnPage(definition, page.id ?? 'unknown')
    const used = questions
      .filter((q) => 'list' in q && q.list === list.id)
      .map((x) => `Page: ${getPageTitle(page)} (Question: ${x.title})`)
    if (used.length) {
      usedIn.push(...used)
    }
  }
  return usedIn
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string[]} [notification]
 */
export function listsViewModel(metadata, definition, notification) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const { pageHeading, pageCaption, pageTitle } = buildHeadings(metadata)

  const pageActions = buildActions(metadata.slug)

  const baseUrl = editorv2Path(metadata.slug, 'list')

  const sortedLists = definition.lists.sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  const pageListModel = {
    lists: sortedLists.map((list) => {
      const used = whereListUsed(definition, list)
      return {
        title: list.title,
        id: list.id,
        usedIn: used.length ? used.join(', ') : 'No questions or conditions',
        editUrl: `${baseUrl}/${list.id}`,
        deleteUrl: `${baseUrl}/${list.id}/delete`
      }
    }),
    pageTitle,
    formSlug: metadata.slug,
    navigation,
    pageHeading,
    pageCaption,
    pageActions,
    notification
  }

  return {
    ...pageListModel,
    backLink: formOverviewBackLink(metadata.slug)
  }
}

/**
 * @import { FormMetadata, FormDefinition, List } from '@defra/forms-model'
 */
