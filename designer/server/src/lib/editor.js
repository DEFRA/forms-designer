import {
  ComponentType,
  ControllerType,
  hasComponents,
  hasComponentsEvenIfNoNext
} from '@defra/forms-model'

import config from '~/src/config.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  getHeaders,
  getPageFromDefinition,
  isCheckboxSelected,
  slugify,
  stringHasValue
} from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

const patchJsonByType = /** @type {typeof patchJson<Page>} */ (patchJson)
const postJsonByType = /** @type {typeof postJson<Page>} */ (postJson)
const postJsonByDefinitionType =
  /** @type {typeof postJson<FormDefinition>} */ (postJson)
const putJsonByType = /** @type {typeof putJson<Page>} */ (putJson)
const delJsonByType = /** @type {typeof delJson<ComponentDef>} */ (delJson)

/**
 * @param {Partial<ComponentDef>} questionDetails
 */
export function getControllerType(questionDetails) {
  return questionDetails.type === ComponentType.FileUploadField
    ? { controller: ControllerType.FileUpload }
    : {}
}

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 * @param {Partial<Page>} [pageDetails]
 */
export async function addPageAndFirstQuestion(
  formId,
  token,
  questionDetails,
  pageDetails
) {
  const requestUrl = new URL(
    `./${formId}/definition/draft/pages`,
    formsEndpoint
  )

  const { body } = await postJsonByType(requestUrl, {
    payload: {
      title: pageDetails?.title ?? '',
      path: `/${slugify(pageDetails?.title ?? questionDetails.title)}`,
      components: [questionDetails],
      ...getControllerType(questionDetails)
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
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {Partial<ComponentDef>} questionDetails
 */
export async function updateQuestion(
  formId,
  token,
  definition,
  pageId,
  questionId,
  questionDetails
) {
  // Determine if page controller should change
  const page = getPageFromDefinition(definition, pageId)
  const origControllerType = page?.controller
  const { controller: newControllerType } = getControllerType(questionDetails)
  if (origControllerType !== newControllerType) {
    // Update page controller
    const pageHeadingRequestUrl = new URL(
      `./${formId}/definition/draft/pages/${pageId}`,
      formsEndpoint
    )
    await patchJsonByType(pageHeadingRequestUrl, {
      payload: {
        controller: newControllerType ?? null
      },
      ...getHeaders(token)
    })
  }

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
  const existingGuidance = components.find((comp, idx) => {
    return comp.type === ComponentType.Markdown && idx === 0
  })

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

  const page = getPageFromDefinition(definition, pageId)
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

  const page = getPageFromDefinition(definition, pageId)
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
 * Re-order the pages as per list of ids
 * @param {string} formId
 * @param {string} token
 * @param {string[]} payload
 */
export async function reorderPages(formId, token, payload) {
  // Update page ordering
  const pageOrderRequestUrl = new URL(
    `./${formId}/definition/draft/pages/order`,
    formsEndpoint
  )

  await postJsonByType(pageOrderRequestUrl, {
    payload,
    ...getHeaders(token)
  })
}

/**
 * Migrates the definition to v2
 * @param {string} formId
 * @param {string} token
 */
export async function migrateDefinitionToV2(formId, token) {
  const migrateToV2RequestUrl = new URL(
    `./${formId}/definition/draft/migrate/v2`,
    formsEndpoint
  )

  const { body } = await postJsonByDefinitionType(migrateToV2RequestUrl, {
    payload: {},
    ...getHeaders(token)
  })

  return body
}

/**
 * Delete a page
 * @param {string} formId
 * @param {string} token
 * @param { string | undefined } pageId
 */
export async function deletePage(formId, token, pageId) {
  const deletePageRequestUrl = new URL(
    `./${formId}/definition/draft/pages/${pageId}`,
    formsEndpoint
  )

  await delJsonByType(deletePageRequestUrl, {
    ...getHeaders(token)
  })
}

/**
 * @import { ComponentDef, Page, FormEditorInputCheckAnswersSettings, FormEditorInputPageSettings, FormDefinition } from '@defra/forms-model'
 */
