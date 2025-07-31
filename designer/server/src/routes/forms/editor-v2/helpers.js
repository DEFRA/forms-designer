import { hasComponentsEvenIfNoNext } from '@defra/forms-model'

import * as forms from '~/src/lib/forms.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'

/**
 * Returns the metadata, definition for a form
 * @param {string} slug - the form slug
 * @param {string} token - the access token
 */
export async function getForm(slug, token) {
  const metadata = await forms.get(slug, token)
  const definition = await forms.getDraftFormDefinition(metadata.id, token)

  return { metadata, definition }
}

/**
 * Returns the metadata, definition and page for a form
 * @param {string} slug - the form slug
 * @param {string} pageId - the page id
 * @param {string} token - the access token
 */
export async function getFormPage(slug, pageId, token) {
  const { metadata, definition } = await getForm(slug, token)
  const page = getPageFromDefinition(definition, pageId)

  return { page, metadata, definition }
}

/**
 * Custom validator for item reordering
 * @param {string|undefined} value
 * @returns {string[]}
 */
export const customItemOrder = (value) => {
  if (value?.length) {
    return value.split(',')
  }

  return []
}

/**
 * Ensure any components that are not in the
 * order array are retained in their current position
 * @param {Page} page
 * @param {string[]} order
 */
export const mergeMissingComponentsIntoOrder = (page, order) => {
  if (hasComponentsEvenIfNoNext(page)) {
    const { components } = page

    components.forEach((component, idx) => {
      if (component.id && !order.includes(component.id)) {
        order.splice(idx, 0, component.id)
      }
    })
  }
}

/**
 * @import { Page } from '@defra/forms-model'
 */
