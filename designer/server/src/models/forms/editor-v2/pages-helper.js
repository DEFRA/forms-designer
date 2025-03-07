import { hasComponents } from '@defra/forms-model'

/**
 * @param {Page} page
 */
export function handlePageTitle(page) {
  if (page.title === '') {
    return {
      ...page,
      title: hasComponents(page) ? page.components[0].title : ''
    }
  }
  return {
    ...page
  }
}

/**
 * @import { Page } from '@defra/forms-model'
 */
