import { type FormStatus } from '~/src/common/enums.js'
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

/**
 * Type for the list items within a Radio or Checkbox nunjucks definition
 */
export interface CheckboxOrRadioItem {
  /**
   * The text to be displayed
   */
  text?: string

  /**
   * If text is set, this is not required. HTML to use within each radio item label
   */
  html?: string

  /**
   * Specific ID attribute for the checkbox/radio item
   */
  id?: string

  /**
   * Name for the checkbox/radio item
   */
  name?: string

  /**
   * Required. Value for the radio input
   */
  value: string

  /**
   * Subset of options for the label
   */
  label?: string

  /**
   * Can be used to add a hint to each item
   */
  hint?: string

  /**
   * Divider text to separate checkbox/radio items, for example the text "or"
   */
  divider?: string

  /**
   * Whether the checkbox/radio should be checked when the page loads
   */
  checked?: boolean

  /**
   * Provide additional content to reveal when the checkbox/radio is checked
   */
  conditional?: {
    html?: string
  }

  /**
   * The behaviour - if set to "exclusive" implements a 'None of thse' type behaviour via Javascript when checkboxes are clicked
   */
  behaviour?: string

  /**
   * If true, checkbox/radio option will be disabled
   */
  disabled?: boolean

  /**
   * HTML attributes (for example data attributes) to add to the checkbox input tag
   */
  attributes?: object
}
