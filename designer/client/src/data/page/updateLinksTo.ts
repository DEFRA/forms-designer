import { hasNext, type FormDefinition, type Page } from '@defra/forms-model'

export function updateLinksTo(
  data: FormDefinition,
  pageFrom: Page,
  pageTo: Pick<Page, 'path'>
) {
  const isOutdated = data.pages.some(({ path }) => path === pageFrom.path)

  if (!isOutdated) {
    return data
  }

  // Copy form definition
  const definition = structuredClone(data)
  const { pages } = definition

  // Check for outdated pages
  for (const pageEdit of pages) {
    if (pageEdit.path === pageFrom.path) {
      pageEdit.path = pageTo.path
    }

    // Skip if page has no links
    if (!hasNext(pageEdit)) {
      continue
    }

    // Check for outdated links
    for (const link of pageEdit.next) {
      if (link.path !== pageFrom.path) {
        continue
      }

      // Update page link
      link.path = pageTo.path
    }
  }

  return definition
}
