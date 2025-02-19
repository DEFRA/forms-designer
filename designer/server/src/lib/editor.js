import { v4 as uuidv4 } from 'uuid'

import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 */
export async function addPage(formId, token, pathSuffix = uuidv4()) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const requestUrl = new URL(
    `./${formId}/definition/draft/pages`,
    formsEndpoint
  )
  const { body } = await postJsonByType(requestUrl, {
    payload: {
      title: 'Untitled',
      path: `/${pathSuffix}`
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {Partial<ComponentDef>} questionDetails
 */
export async function addQuestion(formId, token, pageId, questionDetails) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const requestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}/question`,
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
