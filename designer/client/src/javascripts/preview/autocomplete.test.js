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
      expect(autocompleteElements.autocompleteOptions).toBe(
        'Hydrogen:1\nHelium:2\nLithium:3\nBeryllium:4\n'
      )
    })
  })
})
