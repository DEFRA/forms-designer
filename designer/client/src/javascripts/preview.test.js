import {
  ComponentType,
  DateInputQuestion,
  Question,
  RadioSortableQuestion,
  ShortAnswerQuestion
} from '@defra/forms-model'

import { setupPreview, showHideForJs } from '~/src/javascripts/preview'
import { list1HTML } from '~/src/javascripts/preview/__stubs__/list'
import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewTabsHTML
} from '~/src/javascripts/preview/__stubs__/question'

jest.mock('~/src/javascripts/preview/nunjucks.js')
jest.mock('~/src/views/components/ukaddressfield.njk', () => '')
jest.mock('~/src/views/components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/components/inset.njk', () => '')
jest.mock('~/src/views/components/textfield.njk', () => '')
jest.mock('~/src/views/components/radios.njk', () => '')
jest.mock('~/src/views/components/date-input.njk', () => '')

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('preview', () => {
  describe('setupPreview', () => {
    it('should setup preview for Textfield', () => {
      const res = setupPreview(ComponentType.TextField)
      expect(res).toBeInstanceOf(ShortAnswerQuestion)
    })

    it('should setup preview for DatePartsField', () => {
      const res = setupPreview(ComponentType.DatePartsField)
      expect(res).toBeInstanceOf(DateInputQuestion)
    })

    it('should setup preview for Radiosfield', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.RadiosField)
      expect(res).toBeInstanceOf(RadioSortableQuestion)
    })

    it('should setup preview for unknown', () => {
      // @ts-expect-error - Fallback value, which is not an enum
      const res = setupPreview('unknown')
      expect(res).toBeInstanceOf(Question)
    })
  })

  describe('showHideForJs', () => {
    it('should setup preview for preview panel', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewTabsHTML
      showHideForJs()
      expect(document.getElementById('preview-panel')?.style.cssText).toBe(
        'display: block;'
      )
      expect(
        document.getElementById('preview-error-messages')?.style.cssText
      ).toBe('display: none;')
      expect(document.getElementById('preview-page')?.style.cssText).toBe(
        'display: none;'
      )
    })

    it('should setup leave preview if elements not found', () => {
      document.body.innerHTML = ''
      showHideForJs()
      expect(
        document.getElementById('preview-panel')?.style.cssText
      ).toBeUndefined()
      expect(
        document.getElementById('preview-error-messages')?.style.cssText
      ).toBeUndefined()
      expect(
        document.getElementById('preview-page')?.style.cssText
      ).toBeUndefined()
    })
  })
})
