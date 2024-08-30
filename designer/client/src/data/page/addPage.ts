import { type FormDefinition, type Page } from '@defra/forms-model'

import { findPage } from '~/src/data/page/findPage.js'

export function addPage(data: FormDefinition, page: Page) {
  try {
    // Throw for missing page
    findPage(data, page.path)
  } catch {
    // Copy form definition
    const definition = structuredClone(data)

    // Add new page
    definition.pages.push(page)

    return definition
  }

  return data
}
