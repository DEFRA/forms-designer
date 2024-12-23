import {
  type PaginationOptions,
  type PaginationResult
} from '~/src/common/pagination/types.js'
import { type SearchOptions } from '~/src/common/search/types.js'
import { type SortingOptions } from '~/src/common/sorting/types.js'

/**
 * Options for querying results, including pagination, sorting, and filtering
 */
export type QueryOptions = PaginationOptions & SortingOptions & SearchOptions

/**
 * Metadata containing the optional pagination, sorting, and filtering information
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

  /**
   * The filtering details
   */
  search?: SearchOptions
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
