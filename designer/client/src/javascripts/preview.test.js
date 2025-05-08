import {} from '~/src/javascripts/application'
import { ComponentType } from '@defra/forms-model'

import { setupPreview, showHideForJs } from '~/src/javascripts/preview'
import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewTabsHTML
} from '~/src/javascripts/preview/__stubs__/question'
import { DateInput } from '~/src/javascripts/preview/date-input'
import { Question } from '~/src/javascripts/preview/question'
import { Radio } from '~/src/javascripts/preview/radio'
import { ShortAnswer } from '~/src/javascripts/preview/short-answer.js'

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
jest.mock('~/src/views/components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/components/inset.njk', () => '')
jest.mock('~/src/views/components/textfield.njk', () => '')
jest.mock('~/src/views/components/radios.njk', () => '')
jest.mock('~/src/views/components/date-input.njk', () => '')

describe('preview', () => {
  describe('setupPreview', () => {
    it('should setup preview for Textfield', () => {
      const res = setupPreview(ComponentType.TextField)
      expect(res).toBeInstanceOf(ShortAnswer)
    })

    it('should setup preview for DatePartsField', () => {
      const res = setupPreview(ComponentType.DatePartsField)
      expect(res).toBeInstanceOf(DateInput)
    })

    it('should setup preview for Radiosfield', () => {
      const res = setupPreview(ComponentType.RadiosField)
      expect(res).toBeInstanceOf(Radio)
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
