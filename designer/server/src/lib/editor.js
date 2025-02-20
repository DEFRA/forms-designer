import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'
import { getHeaders, slugify } from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 */
export async function addPageAndFirstQuestion(formId, token, questionDetails) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const requestUrl = new URL(
    `./${formId}/definition/draft/pages`,
    formsEndpoint
  )
  const { body } = await postJsonByType(requestUrl, {
    payload: {
      title: questionDetails.title,
      path: `/${slugify(questionDetails.title)}`,
      components: [questionDetails]
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * Add a question to an existing page
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {Partial<ComponentDef>} questionDetails
 */
export async function addQuestion(formId, token, pageId, questionDetails) {
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const requestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}`,
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
