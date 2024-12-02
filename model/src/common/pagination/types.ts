/**
 * @property {number} page - The current page number.
 * @property {number} perPage - The number of items per page.
 * @property {number} totalItems - The total number of items available.
 * @property {number} totalPages - The total number of pages available.
 */
export interface PaginationResult {
  page: number
  perPage: number
  totalItems: number
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
 * @property {PaginationResult} [pagination] - The pagination details.
 */
export interface Meta {
  pagination?: PaginationResult
}

/**
 * Generic result type for paginated queries
 * @template T The type of items in the result
 * @property {T[]} data - The array of data items.
 * @property {Meta} meta - The metadata about the result.
 */
export interface QueryResult<T> {
  data: T[]
  meta: Meta
}
