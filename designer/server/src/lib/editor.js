import { randomUUID } from 'crypto'

import {
  ComponentType,
  ControllerType,
  hasComponents,
  hasComponentsEvenIfNoNext,
  randomId
} from '@defra/forms-model'

import config from '~/src/config.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'
import { createList, updateList } from '~/src/lib/list.js'
import {
  getHeaders,
  getPageFromDefinition,
  isCheckboxSelected,
  noListToSave,
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
 * @param { string | undefined } id
 * @param { string | undefined } name
 * @param { string | undefined } title
 * @param { QuestionSessionState | undefined } state
 * @returns {List}
 */
export function mapToList(id, name, title, state) {
  return /** @type {List} */ ({
    id: id ?? randomUUID(),
    name: name ?? randomId(),
    title,
    type: 'string',
    items: state?.listItems
      ? state.listItems.map((item) => {
          return {
            // id: item.id,
            text: item.label,
            value: stringHasValue(item.value) ? item.value : item.label
          }
        })
      : []
  })
}

/**
 * @param {string} formId
 * @param {string} path
 */
export function buildRequestUrl(formId, path) {
  return new URL(`./${formId}/definition/draft/${path}`, formsEndpoint)
}

/**
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 * @param { QuestionSessionState | undefined } state
 */
export async function createEditorList(formId, token, questionDetails, state) {
  if (noListToSave(questionDetails.type, state)) {
    return {}
  }

  const list = mapToList(
    undefined,
    undefined,
    `title for ${questionDetails.title}`,
    state
  )

  const body = await createList(formId, token, list)

  if (body.status !== 'created') {
    throw new Error(`Unable to save list for question ${questionDetails.title}`)
  }
  return { list: body.list.name }
}

/**
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ListComponentsDef>} questionDetails
 * @param { QuestionSessionState | undefined } state
 * @param {FormDefinition} definition
 * @returns {Promise<boolean>}
 */
export async function updateEditorList(
  formId,
  token,
  questionDetails,
  state,
  definition
) {
  if (noListToSave(questionDetails.type, state)) {
    return false
  }

  const listFromDef = definition.lists.find(
    (x) => x.name === questionDetails.list
  )

  const list = mapToList(
    listFromDef?.id,
    listFromDef?.name,
    listFromDef?.title,
    state
  )

  // Update list
  const body = await updateList(formId, listFromDef?.id, token, list)
  if (body.status !== 'updated') {
    throw new Error(
      `Unable to update list for question ${questionDetails.title}`
    )
  }
  return true
}

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 * @param {Partial<Page>} [pageDetails]
 * @param { QuestionSessionState | undefined } [state]
 * @returns {Promise<Page>}
 */
export async function addPageAndFirstQuestion(
  formId,
  token,
  questionDetails,
  pageDetails,
  state
) {
  questionDetails.name = questionDetails.name ?? randomId()

  const addedList = await createEditorList(
    formId,
    token,
    questionDetails,
    state
  )

  const { body } = await postJsonByType(buildRequestUrl(formId, 'pages'), {
    payload: {
      title: pageDetails?.title ?? '',
      path: `/${slugify(pageDetails?.title ?? questionDetails.title)}`,
      components: [
        {
          ...questionDetails,
          ...addedList
        }
      ],
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
 * @param { QuestionSessionState | undefined } [state]
 */
export async function addQuestion(
  formId,
  token,
  pageId,
  questionDetails,
  state
) {
  questionDetails.name = questionDetails.name ?? randomId()

  const addedList = await createEditorList(
    formId,
    token,
    questionDetails,
    state
  )

  const { body } = await postJsonByType(
    buildRequestUrl(formId, `pages/${pageId}/components`),
    {
      payload: {
        ...questionDetails,
        ...addedList
      },
      ...getHeaders(token)
    }
  )

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
 * @param { QuestionSessionState | undefined } [state]
 */
export async function updateQuestion(
  formId,
  token,
  definition,
  pageId,
  questionId,
  questionDetails,
  state
) {
  // Determine if page controller should change
  const page = getPageFromDefinition(definition, pageId)
  const origControllerType = page?.controller
  const { controller: newControllerType } = getControllerType(questionDetails)
  if (origControllerType !== newControllerType) {
    // Update page controller
    await patchJsonByType(buildRequestUrl(formId, `pages/${pageId}`), {
      payload: {
        controller: newControllerType ?? null
      },
      ...getHeaders(token)
    })
  }

  await updateEditorList(
    formId,
    token,
    /** @type {ListComponentsDef} */ (questionDetails),
    state,
    definition
  )

  const { body } = await putJsonByType(
    buildRequestUrl(formId, `pages/${pageId}/components/${questionId}`),
    {
      payload: questionDetails,
      ...getHeaders(token)
    }
  )

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
    await delJsonByType(
      buildRequestUrl(
        formId,
        `pages/${pageId}/components/${existingGuidance.id}`
      ),
      {
        ...getHeaders(token)
      }
    )
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
  await patchJsonByType(buildRequestUrl(formId, `pages/${pageId}`), {
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
  await postJsonByType(buildRequestUrl(formId, `pages/order`), {
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
  const { body } = await postJsonByDefinitionType(
    buildRequestUrl(formId, `migrate/v2`),
    {
      payload: {},
      ...getHeaders(token)
    }
  )

  return body
}

/**
 * Delete a page
 * @param {string} formId
 * @param {string} token
 * @param { string | undefined } pageId
 */
export async function deletePage(formId, token, pageId) {
  await delJsonByType(buildRequestUrl(formId, `pages/${pageId}`), {
    ...getHeaders(token)
  })
}

/**
 * @import { ComponentDef, FormEditorInputCheckAnswersSettings, FormEditorInputPageSettings, FormDefinition, List, ListComponentsDef, Page, QuestionSessionState } from '@defra/forms-model'
 */
