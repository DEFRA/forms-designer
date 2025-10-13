import { ComponentType } from '@defra/forms-model'

import { TextField } from '~/src/questions/textfield.js'

/**
 * @param {ComponentType} type
 * @returns { TextField | undefined }
 */
export function createQuestionClass(type) {
  if (type === ComponentType.TextField) {
    return new TextField(type)
  }
  return undefined
}
