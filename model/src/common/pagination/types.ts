/**
 * Result of pagination containing page information
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
 * Metadata containing pagination information
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

/**
 * Generic type for queryable operations that can be called with or without options
 * @template T The type of items being returned
 * @template TOptions The type of query options (defaults to just PaginationOptions)
 */
export interface Queryable<T, TOptions = PaginationOptions> {
  (): Promise<T[]>
  (options: TOptions): Promise<QueryResult<T>>
}
