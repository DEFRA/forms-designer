import { sessionNames } from '~/src/common/constants/session-names.js'

/**
 * @param {Yar} yar
 * @param {FormEditor | undefined} formValues
 */
export function getQuestionType(yar, formValues) {
  const questionTypeFromSession = /** @type {ComponentType | undefined} */ (
    yar.flash(sessionNames.questionType).at(0)
  )

  return /** @type {ComponentType | undefined} */ (
    formValues?.questionType ?? questionTypeFromSession
  )
}

/**
 * @param {Yar} yar
 */
export function clearEnhancedActionState(yar) {
  yar.set(sessionNames.enhancedActionState, null)
}

/**
 * @param {Yar} yar
 */
export function getEnhancedActionStateFromSession(yar) {
  return yar.get(sessionNames.enhancedActionState)
}

/**
 * @param {Yar} yar
 * @param {FormEditorInputQuestionDetails} payload
 * @param {Partial<ComponentDef>} questionDetails
 * @returns { string | undefined }
 */
export function handleEnhancedAction(yar, payload, questionDetails) {
  const { enhancedAction } = payload
  const preState = getEnhancedActionStateFromSession(yar)
  if (enhancedAction === 'add-item') {
    const enhancedActionState = /** @type {EnhancedActionState} */ ({
      questionDetails,
      state: {
        radioLabel: payload.radioLabel,
        radioHint: payload.radioHint,
        radioValue: payload.radioValue,
        expanded: true
      },
      listItems: preState?.state.listItems ?? []
    })
    yar.set(sessionNames.enhancedActionState, enhancedActionState)
    return '#add-option'
  }
  if (enhancedAction === 'save-item') {
    const listItems = preState?.state.listItems ?? []
    listItems.push({
      label: payload.radioLabel,
      hint: payload.radioHint,
      value: payload.radioValue
    })
    const enhancedActionState = /** @type {EnhancedActionState} */ ({
      questionDetails,
      state: {
        radioLabel: payload.radioLabel,
        radioHint: payload.radioHint,
        radioValue: payload.radioValue,
        expanded: true
      },
      listItems
    })
    yar.set(sessionNames.enhancedActionState, enhancedActionState)
    return '#list-items'
  }
  return undefined
}

/**
 * @import { ComponentDef, ComponentType, FormEditor, FormEditorInputQuestionDetails, EnhancedActionState } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
