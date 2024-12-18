import {
  type PaginationOptions,
  type PaginationResult
} from '~/src/common/pagination/types.js'
import { type SortingOptions } from '~/src/common/sorting/types.js'

/**
 * Options for querying results, including pagination and sorting
 */
export type QueryOptions = PaginationOptions & SortingOptions

/**
 * Metadata containing the optional pagination and sorting information
 */
export interface Meta {
  /**
   * The pagination details
   */
  pagination?: PaginationResult

  /**
   * The sorting details
   */
  sorting?: SortingOptions
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
