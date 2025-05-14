import { ComponentType } from '@defra/forms-model'

import {
  panelHTML,
  shortDescInputHTML
} from '~/src/javascripts/error-preview/__stubs__/error-preview'
import { ErrorPreviewDomElements } from '~/src/javascripts/error-preview/error-preview'
import { fieldMappings } from '~/src/javascripts/error-preview/field-mappings'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('error-preview', () => {
  describe('ErrorPreviewDomElements', () => {
    it('should instanciate with no advanced fields', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)
      expect(res).toBeDefined()
      expect(res.advancedFields).toBeDefined()
      expect(res.advancedFields).toEqual([])
      expect(res.shortDesc).toBeDefined()
      expect(res.shortDescTargets).toBeDefined()
    })

    it('should instanciate with some advanced fields', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      expect(res.advancedFields).toBeDefined()
      expect(res.advancedFields).toHaveLength(2)
      expect(res.shortDesc).toBeDefined()
      expect(res.shortDescTargets).toBeDefined()
    })

    it('should add and remove highlights', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const elemsToHighlight = /** @type {HTMLElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      res.addHighlights(elemsToHighlight)
      expect(elemsToHighlight[0].classList).toContain('highlight')
      expect(elemsToHighlight[elemsToHighlight.length - 1].classList).toContain(
        'highlight'
      )
      res.removeHighlights(elemsToHighlight)
      expect(elemsToHighlight[0].classList).not.toContain('highlight')
      expect(
        elemsToHighlight[elemsToHighlight.length - 1].classList
      ).not.toContain('highlight')
    })

    it('should updateText if source has a non-empty text value', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const targets = /** @type {HTMLInputElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      const sourceElem = document.createElement('input')
      sourceElem.value = 'sourcetext'
      res.updateText(sourceElem, targets, '[placeholder]')
      expect(targets[0].textContent).toBe('sourcetext')
      expect(targets[targets.length - 1].textContent).toBe('sourcetext')
    })

    it('should updateText with placeholder if source has an empty text value', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const targets = /** @type {HTMLInputElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      const sourceElem = document.createElement('input')
      sourceElem.value = ''
      res.updateText(sourceElem, targets, '[placeholder]')
      expect(targets[0].textContent).toBe('[placeholder]')
      expect(targets[targets.length - 1].textContent).toBe('[placeholder]')
    })
  })
})
