import { type FormStatus } from '~/src/common/enums.js'

/**
 * Search options for querying forms
 */
export interface SearchOptions {
  /**
   * Search term to filter the results by title
   */
  title?: string

  /**
   * Filter by author's name
   * If provided, shows only forms created by authors with matching name
   */
  author?: string

  /**
   * Filter by organisations
   * Array of organisation names to filter by
   */
  organisations?: string[]

  /**
   * Filter by form status
   * Array of statuses to filter by
   */
  status?: FormStatus[]
}
