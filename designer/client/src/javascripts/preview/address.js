import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class Address extends Question {
  _questionTemplate = 'ukaddressfield.njk'

  /**
   * @type {QuestionBaseModel}
   */
  get renderInput() {
    return {
      id: 'addressField',
      name: 'addressField',
      label: this.label,
      hint: this.hint
    }
  }

  /**
   * @returns {Address}
   */
  static setupPreview() {
    const address = new Address(new QuestionElements())
    address.render()

    return address
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
