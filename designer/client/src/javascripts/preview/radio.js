import {
  List,
  ListEventListeners,
  ListQuestionDomElements
} from '~/src/javascripts/preview/list.js'

export class RadioQuestionDomElements extends ListQuestionDomElements {}

export class RadioEventListeners extends ListEventListeners {}

// push
// deleting
// updating index
//

export class Radio extends List {
  _questionTemplate = 'radios.njk'

  /**
   * @param {RadioQuestionDomElements} listDomElements
   */
  init(listDomElements) {
    const listeners = new RadioEventListeners(this, listDomElements, [])
    listeners.setupListeners()
    /**
     * @type {RadioEventListeners}
     * @private
     */
    this._listeners = listeners
    this.render()
  }
}

/**
 * @import {ListenerRow} from '~/src/javascripts/preview/question.js'
 * @import { ListElement, ListItemReadonly } from '@defra/forms-model'
 */
