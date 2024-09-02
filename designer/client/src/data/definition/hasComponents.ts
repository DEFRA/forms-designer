import { type ComponentDef, type Page } from '@defra/forms-model'

/**
 * Check page has components
 */
export function hasComponents(
  page?: Page
): page is Extract<Page, { components: ComponentDef[] }> {
  return !!page && 'components' in page
}
