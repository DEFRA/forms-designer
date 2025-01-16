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
 * @property {{ text: string }} [pageDescription] - The page description.
 * @property {{ text: string, href: string, classes?: string }[]} [pageActions] - The page actions.
 * @property {FormMetadata[]} formItems - The form items.
 * @property {(PaginationResult & { pages: Array<PaginationPage> }) | undefined} pagination - The pagination details, including pages for the pagination component.
 * @property {string} [notification] - The notificationto display
 * @property {SortingOptions | undefined} sorting - The sorting options.
 * @property {SearchOptions | undefined} search - The search options.
 */

/**
 * @param {string} token
 * @param {QueryOptions} listOptions
 * @param {string} [notification] - success notification to display
 * @returns {Promise<ListViewModel>}
 */
export async function listViewModel(token, listOptions, notification) {
  const pageTitle = 'Forms library'

  const formResponse = await forms.list(token, listOptions)

  const formItems = formResponse.data
  const paginationMeta = formResponse.meta.pagination ?? undefined
  const sortingMeta = formResponse.meta.sorting ?? undefined
  const searchMeta = formResponse.meta.search ?? undefined

  let pagination
  if (paginationMeta) {
    const pages = buildPaginationPages(
      paginationMeta.page,
      paginationMeta.totalPages,
      paginationMeta.perPage,
      sortingMeta,
      searchMeta
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
    pageDescription: {
      text: 'Create or search for a form.'
    },
    pageActions: [
      {
        text: 'Create a new form',
        href: '/create',
        classes: 'govuk-button--inverse'
      }
    ],
    formItems,
    pagination,
    sorting: sortingMeta,
    search: searchMeta,
    notification
  }
}

/**
 * Builds the pages array for the pagination component following the GOV.UK Design System pattern
 * @see {@link https://design-system.service.gov.uk/components/pagination/}
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {number} perPage
 * @param {SortingOptions} [sorting]
 * @param {SearchOptions} [search]
 * @returns {Array<PaginationPage>}
 */
function buildPaginationPages(
  currentPage,
  totalPages,
  perPage,
  sorting,
  search
) {
  const pages = []

  /**
   * Creates a pagination page item.
   * @param {number} pageNumber - The page number.
   * @param {boolean} [isCurrent] - Whether this page is the current page.
   * @returns {PaginationPage} The pagination page item.
   */
  function createPageItem(pageNumber, isCurrent = false) {
    const queryParams = new URLSearchParams({
      page: pageNumber.toString(),
      perPage: perPage.toString()
    })

    if (sorting?.sortBy && sorting.order) {
      const sortValue = sorting.sortBy === 'updatedAt' ? 'updated' : 'title'
      // Converts sort order to proper case (e.g., "asc" -> "Asc", "desc" -> "Desc")
      queryParams.set(
        'sort',
        `${sortValue}${sorting.order.charAt(0).toUpperCase()}${sorting.order.slice(1)}`
      )
    }

    if (search?.title) {
      queryParams.set('title', search.title)
    }

    return {
      number: String(pageNumber),
      href: `${formsLibraryPath}?${queryParams}`,
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
          ],
      links: !metadata.live
        ? [
            {
              text: 'Delete draft',
              href: `${formPath}/delete-draft`
            }
          ]
        : []
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
 * @param {FormMetadata} metadata
 * @param {string} activePage
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
 * @import { FormDefinition, FormMetadata, PaginationResult, QueryOptions, SortingOptions, SearchOptions } from '@defra/forms-model'
 */
