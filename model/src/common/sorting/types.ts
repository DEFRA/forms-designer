/**
 * Options for sorting results
 */
export interface SortingOptions {
  /**
   * The field to sort by. Can be 'updatedAt' or 'title'.
   */
  sortBy?: string

  /**
   * The sort order. Can be 'asc' or 'desc'.
   */
  order?: string
}
