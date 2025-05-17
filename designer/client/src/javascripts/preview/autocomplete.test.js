import {
  buildQuestionStubPanels,
  questionDetailsLeftPanelBuilder,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import { AutocompleteDOMElements } from '~/src/javascripts/preview/autocomplete.js'

describe('autocomplete', () => {
  describe('AutocompleteDOMElements', () => {
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

    it('should return the list elements', () => {
      document.body.innerHTML = buildDom(autocompleteTextarea)
      const autocompleteElements = new AutocompleteDOMElements()
      expect(autocompleteElements.values.items).toEqual([
        { text: 'Hydrogen', value: '1' },
        { text: 'Helium', value: '2' },
        { text: 'Lithium', value: '3' },
        { text: 'Beryllium', value: '4' }
      ])
    })
  })
})
