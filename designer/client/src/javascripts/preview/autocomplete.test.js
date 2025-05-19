import { AutocompleteQuestion } from '@defra/forms-model'

import {
  buildQuestionStubPanels,
  questionDetailsLeftPanelBuilder,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import {
  AutocompleteDOMElements,
  AutocompleteListeners
} from '~/src/javascripts/preview/autocomplete.js'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('autocomplete', () => {
  const autocompleteTextarea = `
    <textarea class="govuk-textarea" id="autoCompleteOptions" name="autoCompleteOptions" rows="5" aria-describedby="autoCompleteOptions-hint">Hydrogen:1
Helium:2
Lithium:3
Beryllium:4
</textarea>`

  /**
   * @param {string} textarea
   * @returns {string}
   */
  function buildDom(textarea) {
    return buildQuestionStubPanels(
      questionDetailsLeftPanelBuilder(textarea),
      questionDetailsPreviewHTML
    )
  }

  describe('AutocompleteDOMElements', () => {
    it('should return the list elements', () => {
      document.body.innerHTML = buildDom(autocompleteTextarea)
      const autocompleteElements = new AutocompleteDOMElements()
      expect(autocompleteElements.autocompleteOptions).toBe(
        'Hydrogen:1\nHelium:2\nLithium:3\nBeryllium:4\n'
      )
    })
  })

  describe('AutocompleteListeners', () => {
    it('custom listeners should work', () => {
      document.body.innerHTML = buildDom(autocompleteTextarea)
      const autocompleteElements = new AutocompleteDOMElements()
      const autocomplete = new AutocompleteQuestion(
        autocompleteElements,
        new NunjucksRenderer(autocompleteElements)
      )
      const autocompleteListener = new AutocompleteListeners(
        autocomplete,
        autocompleteElements
      )
      // @ts-expect-error accessing a protected method to test implementation
      const listeners = autocompleteListener.listeners
      const [optionsEl, listenerFn] = /** @type {ListenerRow} */ (
        listeners.pop()
      )
      if (!optionsEl) {
        throw new Error('test failed')
      }
      optionsEl.value = 'Hydrogen:1\nHelium:2\nLithium:3\nBeryllium:4\nBoron:5'
      listenerFn(optionsEl, /** @type {Event} */ ({}))
      expect(autocomplete.autoCompleteList).toEqual([
        { id: '', text: '', value: '' },
        { id: 'Hydrogen', text: 'Hydrogen', value: '1' },
        { id: 'Helium', text: 'Helium', value: '2' },
        { id: 'Lithium', text: 'Lithium', value: '3' },
        { id: 'Beryllium', text: 'Beryllium', value: '4' },
        { id: 'Boron', text: 'Boron', value: '5' }
      ])
    })
  })
})

/**
 * @import { ListenerRow } from '@defra/forms-model'
 */
