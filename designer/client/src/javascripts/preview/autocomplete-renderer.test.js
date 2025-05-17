// @ts-expect-error no types set for accessible autocomplete
import accessibleAutocomplete from 'accessible-autocomplete'

import { AutocompleteRenderer } from '~/src/javascripts/preview/autocomplete-renderer.js'
import { NJK } from '~/src/javascripts/preview/nunjucks.js'

jest.mock('~/src/views/preview-components/inset.njk', () => '')
jest.mock('accessible-autocomplete', () => ({
  __esModule: true,
  default: {
    enhanceSelectElement: jest.fn()
  }
}))
jest.mock('~/src/javascripts/preview/nunjucks.js', () => ({
  NJK: {
    render: jest.fn().mockReturnValue(`<div class="govuk-form-group">
              <label class="govuk-label" for="autoCompleteField">
                Start typing to select an option
              </label>
              <div id="autoCompleteField-hint" class="govuk-hint">
                Start typing to select an option
              </div>
              <select class="govuk-select" id="autoCompleteField" name="autoCompleteField" aria-describedby="autoCompleteField-hint" data-module="govuk-accessible-autocomplete">
                <option value="1">Hydrogen</option>
                <option value="2">Helium</option>
                <option value="3">Lithium</option>
              </select>
            </div>`)
  }
}))
describe('nunjucks-renderer', () => {
  const model = /** @type {QuestionBaseModel} */ ({
    id: 'f17b7481-60d8-4538-b54a-d3c9f84c986f',
    name: 'AbbcE',
    text: 'Question'
  })

  const mockSetPreviewHTML = jest.fn()
  const mockSetPreviewDOM = jest.fn()
  /**
   * @implements {QuestionElements}
   */
  class QuestionElementMock {
    /** @type {BaseSettings} */
    get values() {
      return /** @type {BaseSettings} */ ({
        question: 'Question',
        hintText: '',
        optional: false,
        shortDesc: '',
        items: []
      })
    }

    /**
     * @param {string} value
     */
    setPreviewHTML(value) {
      mockSetPreviewHTML(value)
    }

    /**
     * @param {HTMLElement} element
     */
    setPreviewDOM(element) {
      mockSetPreviewDOM(element)
    }
  }
  /**
   * @type {QuestionElements}
   */
  const questionElementMock = new QuestionElementMock()
  describe('AutocompleteRenderer', () => {
    document.body.innerHTML = `
      <div class="border-left-container-shorttext" id="question-preview-content">
          <div id="question-preview-inner">
            <div class="govuk-form-group">
              <label class="govuk-label" for="autoCompleteField">
                Start typing to select an option
              </label>
              <div id="autoCompleteField-hint" class="govuk-hint">
                Start typing to select an option
              </div>
              <select class="govuk-select" id="autoCompleteField" name="autoCompleteField" aria-describedby="autoCompleteField-hint" data-module="govuk-accessible-autocomplete">
                <option value="1">Hydrogen</option>
                <option value="2">Helium</option>
                <option value="3">Lithium</option>
              </select>
            </div>
          </div>
        </div>
    `
    it('should render the element', () => {
      const template = 'example.njk'
      const renderer = new AutocompleteRenderer(questionElementMock)
      renderer.render(template, model)
      expect(NJK.render).toHaveBeenCalledWith(template, { model })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(accessibleAutocomplete.enhanceSelectElement).toHaveBeenCalledWith({
        selectElement: expect.any(HTMLSelectElement)
      })
      expect(mockSetPreviewDOM).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    })

    it('should not fail if there is no select field', () => {
      jest.mocked(NJK.render).mockReturnValue('')
      const template = 'example.njk'
      const renderer = new AutocompleteRenderer(questionElementMock)
      renderer.render(template, model)
      expect(true).toBe(true)
    })
  })
})

/**
 * @import { QuestionBaseModel, BaseSettings, QuestionElements } from '@defra/forms-model'
 */
