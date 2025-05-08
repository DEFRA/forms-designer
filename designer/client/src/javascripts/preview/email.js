import {
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class Email extends Question {
  _questionTemplate = 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'

  /**
   * @returns {Email}
   */
  static setupPreview() {
    const email = new Email(new QuestionElements())
    email.render()

    return email
  }
}
