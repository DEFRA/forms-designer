export class QuestionBase {
  /** @type {ComponentType} */
  type

  /** @type {GovukField} */
  question = {} // createTextField('question')

  /**
   * @param {ComponentType} type
   */
  constructor(type) {
    this.type = type
  }
}

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 */
