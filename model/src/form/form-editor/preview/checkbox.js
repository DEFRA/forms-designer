import { ComponentType } from '~/src/components/enums.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class CheckboxQuestion extends ListQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.CheckboxesField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = Question.PATH + 'checkboxesfield.njk'
  listRenderId = 'checkboxField'
  listRenderName = 'checkboxField'
}
