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
export type PaginationOptions = Partial<
  Pick<PaginationResult, 'page' | 'perPage'>
>

/**
 * Metadata containing optional pagination information
 */
export interface Meta {
  /**
   * The pagination details
   */
  pagination?: PaginationResult
}

/**
 * Generic result type for paginated queries
 * @template T The type of items in the result
 */
export interface QueryResult<T> {
  /**
   * The array of data items
   */
  data: T[]

  /**
   * The metadata about the result
   */
  meta: Meta
}
