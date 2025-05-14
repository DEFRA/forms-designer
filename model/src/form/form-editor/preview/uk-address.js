import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'

export class UkAddressQuestion extends FieldsetQuestion {
  _questionTemplate = 'ukaddressfield.njk'
  _fieldName = 'addressField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
