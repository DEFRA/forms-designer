import {
  type PaginationOptions,
  type PaginationResult
} from '~/src/common/pagination/types.js'
import { type SearchOptions } from '~/src/common/search/types.js'
import { type SortingOptions } from '~/src/common/sorting/types.js'

/**
 * Options for querying results, including pagination, sorting, and searching
 */
export type QueryOptions = PaginationOptions & SortingOptions & SearchOptions

/**
 * Available form status values
 */
export type FormStatus = 'draft' | 'live'

/**
 * Available filter options for the current result set
 */
export interface FilterOptions {
  /**
   * List of unique authors in the response
   */
  authors: string[]

  /**
   * List of organizations that have forms
   */
  organisations: string[]

  /**
   * Status values present in the results
   */
  status?: FormStatus[]
}

/**
 * Metadata containing the optional pagination, sorting, and searching information
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
   * The search details
   */
  search?: SearchOptions

  /**
   * Available filter options
   */
  filters?: FilterOptions
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
