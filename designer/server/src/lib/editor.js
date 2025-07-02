import {
  ComponentType,
  ControllerType,
  hasComponents,
  hasComponentsEvenIfNoNext,
  isFormType,
  randomId
} from '@defra/forms-model'

import config from '~/src/config.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  removeUniquelyMappedListFromQuestion,
  removeUniquelyMappedListsFromPage
} from '~/src/lib/list.js'
import {
  getComponentsOnPageFromDefinition,
  getHeaders,
  getPageFromDefinition,
  isCheckboxSelected,
  slugify,
  stringHasValue
} from '~/src/lib/utils.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

const patchJsonByPageType = /** @type {typeof patchJson<Page>} */ (patchJson)
const postJsonByPageType = /** @type {typeof postJson<Page>} */ (postJson)
const postJsonByDefinitionType =
  /** @type {typeof postJson<FormDefinition>} */ (postJson)
const putJsonByPageType = /** @type {typeof putJson<Page>} */ (putJson)
const delJsonByComponentType = /** @type {typeof delJson<ComponentDef>} */ (
  delJson
)

/**
 * @param {Partial<ComponentDef>} questionDetails
 */
export function getControllerType(questionDetails) {
  return questionDetails.type === ComponentType.FileUploadField
    ? { controller: ControllerType.FileUpload }
    : {}
}

/**
 * @param {string} formId
 * @param {string} path
 */
export function buildRequestUrl(formId, path) {
  return new URL(`./${formId}/definition/draft/${path}`, formsEndpoint)
}

/**
 * Add a page to a form definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 * @param {Partial<Page>} [pageDetails]
 * @returns {Promise<Page>}
 */
export async function addPageAndFirstQuestion(
  formId,
  token,
  questionDetails,
  pageDetails
) {
  const { body } = await postJsonByPageType(buildRequestUrl(formId, 'pages'), {
    payload: {
      title: pageDetails?.title ?? '',
      path: `/${slugify(pageDetails?.title ?? questionDetails.title)}`,
      components: [
        {
          ...questionDetails,
          name: questionDetails.name ?? randomId()
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
 */
export async function addQuestion(formId, token, pageId, questionDetails) {
  const { body } = await postJsonByPageType(
    buildRequestUrl(formId, `pages/${pageId}/components`),
    {
      payload: {
        ...questionDetails,
        name: questionDetails.name ?? randomId()
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
 */
export async function updateQuestion(
  formId,
  token,
  definition,
  pageId,
  questionId,
  questionDetails
) {
  const page = getPageFromDefinition(definition, pageId)

  // Are we editing first question on page where there is no page title specified?
  const questions = getComponentsOnPageFromDefinition(
    definition,
    pageId
  ).filter((q) => isFormType(q.type))

  const isFirstQuestionAndNoPageTitle =
    questions.findIndex((comp) => comp.id === questionId) === 0 && !page?.title

  const pagePathForCall = isFirstQuestionAndNoPageTitle
    ? `/${slugify(questionDetails.title)}`
    : page?.path

  // Determine if page controller should change
  const origControllerType = page?.controller
  const { controller: newControllerType } = getControllerType(questionDetails)
  if (
    origControllerType !== newControllerType ||
    isFirstQuestionAndNoPageTitle
  ) {
    // Update page controller and/or page path
    await patchJsonByPageType(buildRequestUrl(formId, `pages/${pageId}`), {
      payload: {
        controller: newControllerType ?? null,
        path: pagePathForCall
      },
      ...getHeaders(token)
    })
  }

  const { body } = await putJsonByPageType(
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
    await delJsonByComponentType(
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
      await putJsonByPageType(guidanceRequestFullUrl, {
        payload: guidancePayload,
        ...getHeaders(token)
      })
    } else {
      await postJsonByPageType(guidanceRequestFullUrl, {
        payload: guidancePayload,
        ...getHeaders(token)
      })
    }
  }
}

/**
 * Update page settings including heading and/or guidance text and repeater options
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {FormDefinition} definition
 * @param {Partial<FormEditorInputPageSettings>} payload
 */
export async function setPageSettings(
  formId,
  token,
  pageId,
  definition,
  payload
) {
  const {
    pageHeading,
    guidanceText,
    repeater,
    minItems,
    maxItems,
    questionSetName
  } = payload

  const page = getPageFromDefinition(definition, pageId)
  const components = hasComponents(page) ? page.components : []

  const isExpanded = isCheckboxSelected(payload.pageHeadingAndGuidance)

  const pageHeadingForCall = isExpanded ? pageHeading : ''
  const pagePathForCall = `/${slugify(resolvePageHeading(page, pageHeadingForCall, components))}`

  // Potentially unset/remove the controllerType if it already is set, and no longer needs a value
  const unsetController = page?.controller ? { controller: null } : {}
  const controller = payload.exitPage
    ? { controller: ControllerType.Terminal }
    : unsetController

  const requestPayload = {
    title: pageHeadingForCall,
    path: pagePathForCall,
    ...controller
  }

  const isCurrentlyRepeater = page?.controller === ControllerType.Repeat

  if (repeater) {
    const repeatName = isCurrentlyRepeater
      ? page.repeat.options.name
      : randomId()

    Object.assign(requestPayload, {
      controller: ControllerType.Repeat,
      repeat: {
        options: {
          name: repeatName,
          title: questionSetName
        },
        schema: {
          min: minItems,
          max: maxItems
        }
      }
    })
  }

  if (isCurrentlyRepeater && !repeater) {
    // Unset the controller (repeat options will be stripped)
    Object.assign(requestPayload, {
      controller: null
    })
  }

  // Update page heading
  await patchJsonByPageType(buildRequestUrl(formId, `pages/${pageId}`), {
    payload: requestPayload,
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
  await postJsonByPageType(buildRequestUrl(formId, `pages/order`), {
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
 * @param {string} pageId
 * @param {FormDefinition} definition
 */
export async function deletePage(formId, token, pageId, definition) {
  await delJsonByComponentType(buildRequestUrl(formId, `pages/${pageId}`), {
    ...getHeaders(token)
  })
  await removeUniquelyMappedListsFromPage(formId, definition, token, pageId)
}

/**
 * Delete a question
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {string} questionId
 * @param {FormDefinition} definition
 */
export async function deleteQuestion(
  formId,
  token,
  pageId,
  questionId,
  definition
) {
  await delJsonByComponentType(
    buildRequestUrl(formId, `pages/${pageId}/components/${questionId}`),
    {
      ...getHeaders(token)
    }
  )
  await removeUniquelyMappedListFromQuestion(
    formId,
    definition,
    token,
    pageId,
    questionId
  )
}

/**
 * Add a condition to a form
 * @param {string} formId
 * @param {string} token
 * @param {ConditionWrapperV2} condition
 */
export async function addCondition(formId, token, condition) {
  const postJsonByConditionType =
    /** @type {typeof postJson<{ id: string, condition: ConditionWrapperV2, status: 'created' }>} */ (
      postJson
    )

  const { body } = await postJsonByConditionType(
    buildRequestUrl(formId, 'conditions'),
    {
      payload: condition,
      ...getHeaders(token)
    }
  )

  return body
}

/**
 * Update an existing condition in a form
 * @param {string} formId
 * @param {string} token
 * @param {ConditionWrapperV2} condition
 */
export async function updateCondition(formId, token, condition) {
  const putJsonByConditionType =
    /** @type {typeof postJson<{ id: string, condition: ConditionWrapperV2, status: 'created' }>} */ (
      putJson
    )

  const { body } = await putJsonByConditionType(
    buildRequestUrl(formId, `conditions/${condition.id}`),
    {
      payload: condition,
      ...getHeaders(token)
    }
  )

  return body
}

/**
 * Set or remove a page condition
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {string | null} conditionName - null to remove condition
 */
export async function setPageCondition(formId, token, pageId, conditionName) {
  const payload = conditionName
    ? { condition: conditionName }
    : { condition: null }

  await patchJsonByPageType(buildRequestUrl(formId, `pages/${pageId}`), {
    payload,
    ...getHeaders(token)
  })
}

/**
 * @import { ComponentDef, FormEditorInputCheckAnswersSettings, FormEditorInputPageSettings, FormDefinition, ConditionWrapperV2, Page } from '@defra/forms-model'
 */
