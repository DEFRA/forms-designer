import Joi from 'joi'

import {
  type CreatePageHrefFn,
  type PaginationOptions,
  type PaginationPage
} from '~/src/common/pagination/types.js'

/**
 * Field definitions for pagination options.
 */
export const paginationOptionFields = {
  page: Joi.number()
    .positive()
    .integer()
    .default(1)
    .min(1)
    .optional()
    .description('Current page number, starting from 1'),
  perPage: Joi.number()
    .positive()
    .integer()
    .default(24)
    .min(1)
    .max(200)
    .optional()
    .description('Number of items to display per page, between 1 and 200')
}

/**
 * Joi schema for `PaginationOptions` interface
 * @see {@link PaginationOptions}
 */
export const paginationOptionsSchema: Joi.ObjectSchema<PaginationOptions> =
  Joi.object(paginationOptionFields)

/**
 * Builds the pages array for the GOV.UK Design System pagination component.
 * Shows first page, last page, current page, and adjacent pages with ellipsis for gaps.
 * @param currentPage - The current page number
 * @param totalPages - The total number of pages
 * @param createHref - Function to generate href for each page number
 * @returns Array of pagination page items
 */
export function buildPaginationPages(
  currentPage: number,
  totalPages: number,
  createHref: CreatePageHrefFn
): PaginationPage[] {
  const pages: PaginationPage[] = []

  /**
   * Creates a pagination page item
   */
  function createPageItem(
    pageNumber: number,
    isCurrent = false
  ): PaginationPage {
    return {
      number: String(pageNumber),
      href: createHref(pageNumber),
      current: isCurrent
    }
  }

  // Always show the first page
  pages.push(createPageItem(1, currentPage === 1))

  // Calculate adjacent page range (one before and one after current)
  const adjacentStartPage = Math.max(currentPage - 1, 2)
  const adjacentEndPage = Math.min(currentPage + 1, totalPages - 1)

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
