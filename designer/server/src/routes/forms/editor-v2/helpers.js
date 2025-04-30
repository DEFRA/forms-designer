import * as forms from '~/src/lib/forms.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'

/**
 * Returns the metadata, definition and page for a form
 * @param {string} slug - the form slug
 * @param {string} pageId - the page id
 * @param {string} token - the access token
 */
export async function getFormPage(slug, pageId, token) {
  const metadata = await forms.get(slug, token)
  const definition = await forms.getDraftFormDefinition(metadata.id, token)
  const page = getPageFromDefinition(definition, pageId)

  return { page, metadata, definition }
}
