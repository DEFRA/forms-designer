import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  ComponentType,
  DateInputQuestion,
  LongAnswerQuestion,
  MonthYearQuestion,
  NumberOnlyQuestion,
  Question,
  RadioSortableQuestion,
  SelectSortableQuestion,
  ShortAnswerQuestion,
  SupportingEvidenceQuestion,
  YesNoQuestion
} from '@defra/forms-model'

import { setupPreview, showHideForJs } from '~/src/javascripts/preview'
import { list1HTML } from '~/src/javascripts/preview/__stubs__/list'
import {
  buildQuestionStubPanels,
  questionDetailsLeftPanelBuilder,
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML,
  questionDetailsPreviewTabsHTML
} from '~/src/javascripts/preview/__stubs__/question'

jest.mock('~/src/javascripts/preview/nunjucks.js')
jest.mock('~/src/javascripts/preview/autocomplete-renderer.js')
jest.mock('~/src/views/preview-components/autocompletefield.njk', () => '')
jest.mock('~/src/views/preview-components/ukaddressfield.njk', () => '')
jest.mock('~/src/views/preview-components/declarationfield.njk', () => '')
jest.mock('~/src/views/preview-components/eastingnorthingfield.njk', () => '')
jest.mock('~/src/views/preview-components/latlongfield.njk', () => '')
jest.mock('~/src/views/preview-components/markdown.njk', () => '')
jest.mock(
  '~/src/views/preview-components/nationalgridfieldnumberfield.njk',
  () => ''
)
jest.mock('~/src/views/preview-components/osgridreffield.njk', () => '')
jest.mock('~/src/views/preview-components/selectfield.njk', () => '')
jest.mock('~/src/views/preview-components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/preview-components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/preview-components/inset.njk', () => '')
jest.mock('~/src/views/preview-components/textfield.njk', () => '')
jest.mock('~/src/views/preview-components/textarea.njk', () => '')
jest.mock('~/src/views/preview-components/radios.njk', () => '')
jest.mock('~/src/views/preview-components/selectfield.njk', () => '')
jest.mock('~/src/views/preview-components/checkboxesfield.njk', () => '')
jest.mock('~/src/views/preview-components/date-input.njk', () => '')
jest.mock('~/src/views/preview-components/monthyearfield.njk', () => '')
jest.mock('~/src/views/preview-components/fileuploadfield.njk', () => '')

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('preview', () => {
  describe('setupPreview', () => {
    it('should setup preview for Textfield', () => {
      const res = setupPreview(ComponentType.TextField)
      expect(res).toBeInstanceOf(ShortAnswerQuestion)
    })
    it('should setup preview for NumberField', () => {
      const res = setupPreview(ComponentType.NumberField)
      expect(res).toBeInstanceOf(NumberOnlyQuestion)
    })

    it('should setup preview for DatePartsField', () => {
      const res = setupPreview(ComponentType.DatePartsField)
      expect(res).toBeInstanceOf(DateInputQuestion)
    })

    it('should setup preview for MultilineTextField', () => {
      const res = setupPreview(ComponentType.MultilineTextField)
      expect(res).toBeInstanceOf(LongAnswerQuestion)
    })

    it('should setup preview for Radiosfield', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.RadiosField)
      expect(res).toBeInstanceOf(RadioSortableQuestion)
    })

    it('should setup preview for CheckboxField', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.CheckboxesField)
      expect(res).toBeInstanceOf(CheckboxSortableQuestion)
    })

    it('should setup preview for Selectfield', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.SelectField)
      expect(res).toBeInstanceOf(SelectSortableQuestion)
    })

    it('should setup preview for AutoCompleteField', () => {
      const autocompleteTextarea = `
    <textarea class="govuk-textarea" id="autoCompleteOptions" name="autoCompleteOptions" rows="5" aria-describedby="autoCompleteOptions-hint">Hydrogen:1
Helium:2
Lithium:3
Beryllium:4
</textarea>`

      document.body.innerHTML = buildQuestionStubPanels(
        questionDetailsLeftPanelBuilder(autocompleteTextarea),
        questionDetailsPreviewHTML
      )
      const res = setupPreview(ComponentType.AutocompleteField)
      expect(res).toBeInstanceOf(AutocompleteQuestion)
    })

    it('should setup preview for YesNo', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.YesNoField)
      expect(res).toBeInstanceOf(YesNoQuestion)
    })

    it('should setup preview for MonthYearField', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.MonthYearField)
      expect(res).toBeInstanceOf(MonthYearQuestion)
    })

    it('should setup preview for SupportingEvidenceQuestion', () => {
      document.body.innerHTML = list1HTML
      const res = setupPreview(ComponentType.FileUploadField)
      expect(res).toBeInstanceOf(SupportingEvidenceQuestion)
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
