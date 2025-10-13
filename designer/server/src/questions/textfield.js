import { QuestionBase } from '~/src/questions/question-base.js'
import {
  classes,
  maxLength,
  minLength,
  regex
} from '~/src/questions/question-fields.js'

export class TextField extends QuestionBase {
  /**
   * @param {ComponentType} type
   */
  constructor(type) {
    super(type)

    /** @type {Record<string, GovukField>} */
    this.advancedFields = [minLength, maxLength, regex, classes]
  }
}

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 */
