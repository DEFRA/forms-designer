import '~/src/views/components/inset.njk'
import {
  List,
  ListEventListeners,
  ListQuestionElements
} from '~/src/javascripts/preview/list.js'

export class RadioQuestionElements extends ListQuestionElements {}

export class RadioEventListeners extends ListEventListeners {}

// push
// deleting
// updating index
//

export class Radio extends List {
  _questionTemplate = 'radios.njk'

  /**
   * @param {RadioQuestionElements} listDomElements
   */
  init(listDomElements) {
    const listeners = new RadioEventListeners(this, listDomElements, [])
    listeners.setupListeners()

    /**
     * @type {EventListeners}
     * @private
     */
    this._listeners = listeners
    this.render()
  }

  static setupPreview() {
    const elements = new RadioQuestionElements()
    const radio = new Radio(elements)
    radio.init(elements)

    return radio
  }
}

/**
 * @import {ListenerRow} from '~/src/javascripts/preview/question.js'
 * @import { ListElement, ListItemReadonly } from '@defra/forms-model'
 */
