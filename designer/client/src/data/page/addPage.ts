import {
  ControllerType,
  Engine,
  type FormDefinition,
  type Page
} from '@defra/forms-model'

import { findPage } from '~/src/data/page/findPage.js'

export function addPage(data: FormDefinition, page: Page) {
  try {
    // Throw for missing page
    findPage(data, page.path)
  } catch {
    // Copy form definition
    const definition = structuredClone(data)

    // Add new page
    if (data.engine === Engine.V2) {
      // If this new page is a "Start" page, add it as the first page
      if (page.controller === ControllerType.Start) {
        definition.pages.splice(0, 0, page)
      } else {
        const lastPage = data.pages.at(data.pages.length - 1)

        // If the last page is a "Summary" page, add this new page before it
        if (lastPage?.controller === ControllerType.Summary) {
          definition.pages.splice(data.pages.length - 1, 0, page)
        } else {
          definition.pages.push(page)
        }
      }
    } else {
      definition.pages.push(page)
    }

    return definition
  }

  return data
}
