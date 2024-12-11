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
 * Metadata containing optional pagination information
 */
export interface Meta {
  /**
   * The pagination details
   */
  pagination?: PaginationResult
}

/**
 * Standard response wrapper for query results with metadata
 */
export interface QueryResult<Model> {
  /**
   * The array of data items
   */
  data: Model[]

  /**
   * The metadata about the result
   */
  meta: Meta
}
