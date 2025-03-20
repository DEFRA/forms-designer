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
 * @import { ComponentType, FormEditor } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
