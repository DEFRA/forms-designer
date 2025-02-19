import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * Add a page to a form definition
 * @param {string} id
 * @param {string} token
 * @param {string} title - page title
 * @param {string} path - page path
 */
export async function addPage(id, token, title, path) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const requestUrl = new URL(`./${id}/definition/draft/pages`, formsEndpoint)
  const { body } = await postJsonByType(requestUrl, {
    payload: {
      title,
      path
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * @import { Page } from '@defra/forms-model'
 */
