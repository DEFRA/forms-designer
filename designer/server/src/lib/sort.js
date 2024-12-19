/**
 * Get sort options from query parameter
 * @param {string | undefined} sort - The sort query parameter
 * @returns {{ sortBy?: string, order?: string }} Sort options for the forms list
 */
export function getSortOptions(sort) {
  if (!sort) return {}

  if (sort.startsWith('updated')) {
    return {
      sortBy: 'updatedAt',
      order: sort === 'updatedDesc' ? 'desc' : 'asc'
    }
  }

  return {
    sortBy: 'title',
    order: sort === 'titleDesc' ? 'desc' : 'asc'
  }
}
