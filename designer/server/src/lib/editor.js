import { ComponentType } from '@defra/forms-model'

import config from '~/src/config.js'
import { patchJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  getHeaders,
  isCheckboxSelected,
  slugify,
  stringHasValue
} from '~/src/lib/utils.js'

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
 * Determine page heading
 * @param {boolean} isExpanded
 * @param {Page | undefined} page
 * @param {string | undefined} pageHeading
 * @param {ComponentDef[]} components
 */
export function resolvePageHeading(isExpanded, page, pageHeading, components) {
  const firstQuestion = components.find(
    (comp) => comp.type !== ComponentType.Html
  )
  if (!isExpanded) {
    return firstQuestion?.title ?? ''
  }

  const pageTitle = stringHasValue(pageHeading) ? pageHeading : page?.title
  return stringHasValue(pageHeading)
    ? pageHeading
    : stringHasValue(firstQuestion?.title)
      ? firstQuestion?.title
      : pageTitle
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
  const putJsonByType = /** @type {typeof putJson<Page>} */ (putJson)

  const { pageHeading, guidanceText } = payload

  const page = definition.pages.find((x) => x.id === pageId)
  const components = page && 'components' in page ? page.components : []

  const isExpanded = isCheckboxSelected(payload.pageHeadingAndGuidance)

  const resolvedPageHeading = resolvePageHeading(
    isExpanded,
    page,
    pageHeading,
    components
  )

  // Update page heading
  const pageHeadingRequestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}`,
    formsEndpoint
  )
  await patchJsonByType(pageHeadingRequestUrl, {
    payload: {
      title: resolvedPageHeading,
      path: `/${slugify(resolvedPageHeading)}`
    },
    ...getHeaders(token)
  })

  // Insert a guidance component, or update if it already exists, or remove if no longer used
  const existingGuidance = components.find(
    (comp, idx) => comp.type === ComponentType.Html && idx === 0
  )

  if (existingGuidance && (!stringHasValue(guidanceText) || !isExpanded)) {
    // Remove guidance component since the user has blanked out the guidance text now or unchecked the checkbox
    // TODO - call DELETE endpoint
    return
  }

  if (isExpanded && stringHasValue(guidanceText)) {
    const guidancePayload = {
      id: existingGuidance?.id,
      type: ComponentType.Html,
      content: guidanceText
    }

    const guidanceRequestUrl = existingGuidance
      ? `./${formId}/definition/draft/pages/${pageId}/components/${existingGuidance.id}`
      : `./${formId}/definition/draft/pages/${pageId}/components?prepend=true`

    const guidanceRequestFullUrl = new URL(guidanceRequestUrl, formsEndpoint)

    if (existingGuidance) {
      await putJsonByType(guidanceRequestFullUrl, {
        payload: guidancePayload,
        ...getHeaders(token)
      })
    } else {
      await postJsonByType(guidanceRequestFullUrl, {
        payload: guidancePayload,
        ...getHeaders(token)
      })
    }
  }
}

/**
 * @import { ComponentDef, Page, FormEditorInputPageSettings, FormDefinition } from '@defra/forms-model'
 */
