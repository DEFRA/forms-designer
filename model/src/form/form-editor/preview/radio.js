import { ComponentType } from '~/src/components/enums.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { Question } from '~/src/index.js'

export class RadioQuestion extends ListQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.RadiosField
  _questionTemplate = Question.PATH + 'radios.njk'
}
