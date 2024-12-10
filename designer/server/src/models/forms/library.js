import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'
import {
  formOverviewBackLink,
  formOverviewPath,
  formsLibraryBackLink,
  formsLibraryPath
} from '~/src/models/links.js'

/**
 * @typedef {object} PaginationPage
 * @property {string} [number] - The page number (if it's a page).
 * @property {string} [href] - The URL for the page.
 * @property {boolean} [current] - Whether this page is the current page.
 * @property {boolean} [ellipsis] - Whether this entry is an ellipsis.
 */

/**
 * @typedef {object} ListViewModel
 * @property {string} pageTitle - The number of items per page.
 * @property {{ text: string }} pageHeading - The page heading.
 * @property {Array<FormMetadata>} formItems - The form items.
 * @property {(PaginationResult & { pages: Array<PaginationPage> }) | undefined} pagination - The pagination.
 */

/**
 * @param {string} token
 * @param {PaginationOptions} paginationOptions
 * @returns {Promise<ListViewModel>}
 */
export async function listViewModel(token, paginationOptions) {
  const pageTitle = 'Forms library'

  const formResponse = await forms.list(token, paginationOptions)

  const formItems = formResponse.data
  const paginationMeta = formResponse.meta.pagination ?? undefined

  let pagination
  if (paginationMeta) {
    const pages = buildPaginationPages(
      paginationMeta.page,
      paginationMeta.totalPages,
      paginationMeta.perPage
    )
    pagination = {
      ...paginationMeta,
      pages
    }
  }

  return {
    pageTitle,
    pageHeading: {
      text: pageTitle
    },
    formItems,
    pagination
  }
}

/**
 * Builds the pages array for the pagination component following the GOV.UK Design System pattern
 * @see {@link https://design-system.service.gov.uk/components/pagination/}
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {number} perPage
 * @returns {Array<PaginationPage>}
 */
function buildPaginationPages(currentPage, totalPages, perPage) {
  const pages = []

  /**
   * Creates a pagination page item.
   * @param {number} pageNumber - The page number.
   * @param {boolean} [isCurrent] - Whether this page is the current page.
   * @returns {PaginationPage} The pagination page item.
   */
  function createPageItem(pageNumber, isCurrent = false) {
    return {
      number: String(pageNumber),
      href: `${formsLibraryPath}?page=${pageNumber}&perPage=${perPage}`,
      current: isCurrent
    }
  }

  // Always show the first page
  pages.push(createPageItem(1, currentPage === 1))

  let adjacentStartPage = currentPage - 1
  let adjacentEndPage = currentPage + 1

  // adjacentStartPage (in range) is at least 2
  if (adjacentStartPage < 2) {
    adjacentStartPage = 2
  }

  // Ensure adjacentEndPage (in range) is at most totalPages - 1
  if (adjacentEndPage > totalPages - 1) {
    adjacentEndPage = totalPages - 1
  }

  // Add ellipsis after first page if needed
  if (adjacentStartPage > 2) {
    pages.push({ ellipsis: true })
  }

  // Add pages between adjacentStartPage and adjacentEndPage
  for (let i = adjacentStartPage; i <= adjacentEndPage; i++) {
    pages.push(createPageItem(i, i === currentPage))
  }

  // Add ellipsis before last page if needed
  if (adjacentEndPage < totalPages - 1) {
    pages.push({ ellipsis: true })
  }

  // Always show the last page if totalPages > 1
  if (totalPages > 1) {
    pages.push(createPageItem(totalPages, currentPage === totalPages))
  }

  return pages
}

/**
 * @param {FormMetadata} metadata
 * @param {string} [notification] - success notification to display
 */
export function overviewViewModel(metadata, notification) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)

  const navigation = getFormSpecificNavigation(formPath, metadata, 'Overview')

  return {
    backLink: formsLibraryBackLink,
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    form: metadata,
    formManage: {
      heading: {
        text: 'Manage form',
        size: 'medium',
        level: '3'
      },

      // Adjust default action when draft is available
      ...(!metadata.draft
        ? {
            action: `${formPath}/create-draft-from-live`,
            method: 'POST'
          }
        : {
            action: `${formPath}/editor`,
            method: 'GET'
          }),

      // Adjust buttons when draft is available
      buttons: !metadata.draft
        ? [{ text: 'Create draft to edit' }]
        : [
            {
              text: 'Edit draft',
              classes: 'govuk-button--secondary-quiet'
            },
            {
              text: 'Make draft live',
              attributes: {
                formaction: `${formPath}/make-draft-live`
              }
            }
          ]
    },
    previewUrl: config.previewUrl,
    notification
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function editorViewModel(metadata, definition) {
  const pageTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)

  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  return {
    backLink: formOverviewBackLink(metadata.slug),
    navigation,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    form: metadata,
    formDefinition: definition,
    previewUrl: config.previewUrl
  }
}

/**
 * Returns the navigation bar items as an array. Where activePage matches
 * a page, that page will have isActive:true set.
 * @param {string} formPath
 * @param {string} activePage
 * @param {FormMetadata} metadata
 */
export function getFormSpecificNavigation(formPath, metadata, activePage = '') {
  const navigationItems = [
    ['Forms library', formsLibraryPath],
    ['Overview', formPath]
  ]

  if (metadata.draft) {
    navigationItems.push(['Editor', `${formPath}/editor`])
  }

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @import { FormDefinition, FormMetadata, PaginationResult, PaginationOptions } from '@defra/forms-model'
 */
