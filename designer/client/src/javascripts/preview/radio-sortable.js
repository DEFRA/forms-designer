import '~/src/views/components/inset.njk'
import {
  ListSortable,
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable'

export class RadioSortableQuestionElements extends ListSortableQuestionElements {}

export class RadioSortableEventListeners extends ListSortableEventListeners {}

export class RadioSortable extends ListSortable {
  _questionTemplate = 'radios.njk'

  static setupPreview() {
    const elements = new RadioSortableQuestionElements()
    const radio = new RadioSortable(elements)
    radio.render()

    return radio
  }
}
