/**
 * Result of pagination containing page information
 */
export interface PaginationResult {
  /**
   * The current page number.
   */
  page: number

  /**
   * The number of items per page.
   */
  perPage: number

  /**
   * The total number of items available.
   */
  totalItems: number

  /**
   * The total number of pages available.
   */
  totalPages: number
}

/**
 * Options for paginating results
 * Allows partial specification of page and perPage from PaginationResult
 */
export type PaginationOptions = Required<
  Pick<PaginationResult, 'page' | 'perPage'>
>

/**
 * A single page item for the pagination component
 */
export interface PaginationPage {
  /**
   * The page number (if it's a page, not an ellipsis)
   */
  number?: string

  /**
   * The URL for the page
   */
  href?: string

  /**
   * Whether this page is the current page
   */
  current?: boolean

  /**
   * Whether this entry is an ellipsis (gap indicator)
   */
  ellipsis?: boolean
}

/**
 * Callback function to generate href for a given page number
 */
export type CreatePageHrefFn = (pageNumber: number) => string

/**
 * Pagination result with page items for the pagination component
 * Extends PaginationResult with the pages array needed for rendering
 */
export interface PaginationResultWithPages extends PaginationResult {
  /**
   * Page items for the pagination component
   */
  pages: PaginationPage[]
}
