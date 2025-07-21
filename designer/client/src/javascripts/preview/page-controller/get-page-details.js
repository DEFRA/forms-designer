import { getPageFromDefinition } from '@defra/forms-model'

/**
 * @param {string} formId
 * @param { string | undefined } pageId
 * @returns {Promise<{page: Page, definition: FormDefinition>}
 */
export async function getPageAndDefinition(formId, pageId) {
  const response = await global.fetch(`/api/${formId}/data`)
  const definition = await response.json()
  const page = getPageFromDefinition(definition, pageId)

  return {
    page,
    definition
  }
}

/**
 * @import { Page, FormDefinition } from '@defra/forms-model'
 */
