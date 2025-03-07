import {
  ComponentType,
  hasComponents,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import config from '~/src/config.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  getHeaders,
  isCheckboxSelected,
  slugify,
  stringHasValue
} from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

const patchJsonByType = /** @type {typeof patchJson<Page>} */ (patchJson)
const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)
const putJsonByType = /** @type {typeof putJson<Page>} */ (putJson)
const delJsonByType = /** @type {typeof delJson<ComponentDef>} */ (delJson)

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 */
export async function addPageAndFirstQuestion(formId, token, questionDetails) {
  const requestUrl = new URL(
    `./${formId}/definition/draft/pages`,
    formsEndpoint
  )

  const { body } = await postJsonByType(requestUrl, {
    payload: {
      title: '',
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
  const requestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}/components`,
    formsEndpoint
  )
  const { body } = await postJsonByType(requestUrl, {
    payload: questionDetails,
    ...getHeaders(token)
  })

  return body
}

/**
 * Add a question to an existing page
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {string} questionId
 * @param {Partial<ComponentDef>} questionDetails
 */
export async function updateQuestion(
  formId,
  token,
  pageId,
  questionId,
  questionDetails
) {
  const requestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}/components/${questionId}`,
    formsEndpoint
  )
  const { body } = await putJsonByType(requestUrl, {
    payload: questionDetails,
    ...getHeaders(token)
  })

  return body
}

/**
 * Determine page heading
 * @param {Page | undefined} page
 * @param {string | undefined} pageHeading
 * @param {ComponentDef[]} components
 */
export function resolvePageHeading(page, pageHeading, components) {
  const firstQuestion = components.find(
    (comp) => comp.type !== ComponentType.Markdown
  )

  const pageTitle = stringHasValue(pageHeading) ? pageHeading : page?.title
  const firstQuestionFallback = stringHasValue(firstQuestion?.title)
    ? firstQuestion?.title
    : pageTitle
  return stringHasValue(pageHeading) ? pageHeading : firstQuestionFallback
}

/**
 * Insert, update or delete a guidance component
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {ComponentDef[]} components
 * @param {boolean} isExpanded
 * @param {string | undefined} guidanceText
 */
export async function insertUpdateOrDeleteGuidance(
  formId,
  token,
  pageId,
  components,
  isExpanded,
  guidanceText
) {
  // Insert a guidance component, or update if it already exists, or remove if no longer used
  const existingGuidance = components.find(
    (comp, idx) => comp.type === ComponentType.Markdown && idx === 0
  )

  if (existingGuidance && (!stringHasValue(guidanceText) || !isExpanded)) {
    // Remove guidance component since the user has blanked out the guidance text now or unchecked the checkbox
    const delCGuidanceRequestUrl = new URL(
      `./${formId}/definition/draft/pages/${pageId}/components/${existingGuidance.id}`,
      formsEndpoint
    )
    await delJsonByType(delCGuidanceRequestUrl, {
      ...getHeaders(token)
    })
    return
  }

  if (isExpanded && stringHasValue(guidanceText)) {
    const guidancePayload = {
      id: existingGuidance?.id,
      type: ComponentType.Markdown,
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
 * Set page heading and/or guidance text
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
  const { pageHeading, guidanceText } = payload

  const page = definition.pages.find((x) => x.id === pageId)
  const components = hasComponents(page) ? page.components : []

  const isExpanded = isCheckboxSelected(payload.pageHeadingAndGuidance)

  const pageHeadingForCall = isExpanded ? pageHeading : ''
  const pagePathForCall = `/${slugify(resolvePageHeading(page, pageHeading, components))}`

  // Update page heading
  const pageHeadingRequestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}`,
    formsEndpoint
  )
  await patchJsonByType(pageHeadingRequestUrl, {
    payload: {
      title: pageHeadingForCall,
      path: pagePathForCall
    },
    ...getHeaders(token)
  })

  await insertUpdateOrDeleteGuidance(
    formId,
    token,
    pageId,
    components,
    isExpanded,
    guidanceText
  )
}

/**
 * Set check-answers declaration text
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {FormDefinition} definition
 * @param {Partial<FormEditorInputCheckAnswersSettings>} payload
 */
export async function setCheckAnswersDeclaration(
  formId,
  token,
  pageId,
  definition,
  payload
) {
  const { declarationText } = payload

  const page = definition.pages.find((x) => x.id === pageId)
  // Unable to use hasComponents() method since Summary page does not contain 'next' property
  const components = hasComponentsEvenIfNoNext(page) ? page.components : []

  const isExpanded = isCheckboxSelected(payload.needDeclaration)

  await insertUpdateOrDeleteGuidance(
    formId,
    token,
    pageId,
    components,
    isExpanded,
    declarationText
  )
}

/**
 * @import { ComponentDef, Page, FormEditorInputCheckAnswersSettings, FormEditorInputPageSettings, FormDefinition } from '@defra/forms-model'
 */
