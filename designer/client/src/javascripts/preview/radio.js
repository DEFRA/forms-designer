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

  static setupPreview() {
    const elements = new RadioQuestionElements()
    const radio = new Radio(elements)
    radio.render()

    return radio
  }
}
