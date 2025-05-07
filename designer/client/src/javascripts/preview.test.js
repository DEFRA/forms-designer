import {} from '~/src/javascripts/application'
import { setupPreview, showHideForJs } from '~/src/javascripts/preview'
import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewTabsHTML
} from '~/src/javascripts/preview/__stubs__/question'
import { DateInput } from '~/src/javascripts/preview/date-input'
import { Question } from '~/src/javascripts/preview/question'
import { Radio } from '~/src/javascripts/preview/radio'
import { Textfield } from '~/src/javascripts/preview/textfield'

jest.mock('~/src/javascripts/preview/nunjucks.js')

jest.mock(
  '~/src/views/components/inset.njk',
  () => '<div class="govuk-inset-text"></div>'
)
jest.mock(
  '~/src/views/components/textfield.njk',
  () =>
    '<input class="govuk-input" id="question" name="question" type="text" value="What is your answer?">'
)
jest.mock('~/src/views/components/ukaddressfield.njk', () => '')
jest.mock('~/src/views/components/inset.njk', () => '')
jest.mock('~/src/views/components/textfield.njk', () => '')
jest.mock('~/src/views/components/radios.njk', () => '')
jest.mock('~/src/views/components/date-input.njk', () => '')

describe('preview', () => {
  describe('setupPreview', () => {
    it('should setup preview for Textfield', () => {
      const res = setupPreview('textfield')
      expect(res).toBeInstanceOf(Textfield)
    })

    it('should setup preview for DatePartsField', () => {
      const res = setupPreview('datepartsfield')
      expect(res).toBeInstanceOf(DateInput)
    })

    it('should setup preview for Radiosfield', () => {
      const res = setupPreview('radiosfield')
      expect(res).toBeInstanceOf(Radio)
    })

    it('should setup preview for unknown', () => {
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
