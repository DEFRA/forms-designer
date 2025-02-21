import { ComponentType } from '@defra/forms-model'

import config from '~/src/config.js'
import { patchJson, postJson } from '~/src/lib/fetch.js'
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
 * Add a question to an existing page
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {FormDefinition} definition
 * @param {Partial<FormEditorInputPageSettings>} payload
 */
export async function setPageHeadingAndGuidance(
  formId,
  token,
  pageId,
  definition,
  payload
) {
  const patchJsonByType = /** @type {typeof patchJson<Page>} */ (patchJson)
  const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)

  const { pageHeading, guidanceText } = payload

  // Update page heading
  const pageHeadingRequestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}`,
    formsEndpoint
  )
  await patchJsonByType(pageHeadingRequestUrl, {
    payload: {
      title: pageHeading
    },
    ...getHeaders(token)
  })

  // Insert a guidance component (or update if it already exists)
  const guidanceRequestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}/components`,
    formsEndpoint
  )
  await postJsonByType(guidanceRequestUrl, {
    payload: {
      type: ComponentType.Html,
      content: guidanceText
    },
    ...getHeaders(token)
  })
}

/**
 * @import { ComponentDef, Page, FormEditorInputPageSettings, FormDefinition } from '@defra/forms-model'
 */
