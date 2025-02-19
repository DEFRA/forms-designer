import { v4 as uuidv4 } from 'uuid'
import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * Add a page to a form definition
 * @param {string} id
 * @param {string} token
 */
export async function addPage(id, token) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const unique = uuidv4()

  const requestUrl = new URL(`./${id}/definition/draft/pages`, formsEndpoint)
  const { body } = await postJsonByType(requestUrl, {
    payload: {
      title: 'Untitled',
      path: `/${unique}`
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * Add a page to a form definition
 * @param {string} id
 * @param {string} token
 * @param {string} pageId
 * @param {ComponentDef} questionDetails
 */
export async function addQuestion(id, token, pageId, questionDetails) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const requestUrl = new URL(
    `./${id}/definition/draft/pages/${pageId}/question`,
    formsEndpoint
  )
  const { body } = await postJsonByType(requestUrl, {
    payload: {
      questionDetails
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * @import { ComponentDef, Page } from '@defra/forms-model'
 */
