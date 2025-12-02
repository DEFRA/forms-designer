import {
  AutocompleteQuestion,
  CheckboxSortableQuestion,
  ComponentType,
  DateInputQuestion,
  DeclarationQuestion,
  EmailAddressQuestion,
  ListSortableQuestion,
  LongAnswerQuestion,
  MonthYearQuestion,
  NumberOnlyQuestion,
  PhoneNumberQuestion,
  Question,
  RadioSortableQuestion,
  SelectSortableQuestion,
  ShortAnswerQuestion,
  SupportingEvidenceQuestion,
  UkAddressQuestion,
  YesNoQuestion
} from '@defra/forms-model'

import {
  buildQuestionStubPanels,
  questionDetailsLeftPanelBuilder,
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('SetupPreview', () => {
  beforeEach(() => {
    document.body.innerHTML =
      questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
  })

  describe('Question', () => {
    it('should create Question instance', () => {
      const result = SetupPreview('Question')
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('Html', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.Html)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('InsetText', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.InsetText)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('Details', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.Details)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('List', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.List)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('Markdown', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.Markdown)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('TextField', () => {
    it('should create ShortAnswerQuestion instance', () => {
      const result = SetupPreview(ComponentType.TextField)
      expect(result).toBeInstanceOf(ShortAnswerQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('NumberField', () => {
    it('should create NumberOnlyQuestion instance', () => {
      const result = SetupPreview(ComponentType.NumberField)
      expect(result).toBeInstanceOf(NumberOnlyQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('MultilineTextField', () => {
    it('should create LongAnswerQuestion instance', () => {
      const result = SetupPreview(ComponentType.MultilineTextField)
      expect(result).toBeInstanceOf(LongAnswerQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('DatePartsField', () => {
    it('should create DateInputQuestion instance', () => {
      const result = SetupPreview(ComponentType.DatePartsField)
      expect(result).toBeInstanceOf(DateInputQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('MonthYearField', () => {
    it('should create MonthYearQuestion instance', () => {
      const result = SetupPreview(ComponentType.MonthYearField)
      expect(result).toBeInstanceOf(MonthYearQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('EmailAddressField', () => {
    it('should create EmailAddressQuestion instance', () => {
      const result = SetupPreview(ComponentType.EmailAddressField)
      expect(result).toBeInstanceOf(EmailAddressQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('FileUploadField', () => {
    it('should create SupportingEvidenceQuestion instance', () => {
      const result = SetupPreview(ComponentType.FileUploadField)
      expect(result).toBeInstanceOf(SupportingEvidenceQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('UkAddressField', () => {
    it('should create UkAddressQuestion instance', () => {
      const result = SetupPreview(ComponentType.UkAddressField)
      expect(result).toBeInstanceOf(UkAddressQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('YesNoField', () => {
    it('should create YesNoQuestion instance', () => {
      const result = SetupPreview(ComponentType.YesNoField)
      expect(result).toBeInstanceOf(YesNoQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('TelephoneNumberField', () => {
    it('should create PhoneNumberQuestion instance', () => {
      const result = SetupPreview(ComponentType.TelephoneNumberField)
      expect(result).toBeInstanceOf(PhoneNumberQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('RadiosField', () => {
    it('should create RadioSortableQuestion instance', () => {
      const result = SetupPreview(ComponentType.RadiosField)
      expect(result).toBeInstanceOf(RadioSortableQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('SelectField', () => {
    it('should create SelectSortableQuestion instance', () => {
      const result = SetupPreview(ComponentType.SelectField)
      expect(result).toBeInstanceOf(SelectSortableQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('CheckboxesField', () => {
    it('should create CheckboxSortableQuestion instance', () => {
      const result = SetupPreview(ComponentType.CheckboxesField)
      expect(result).toBeInstanceOf(CheckboxSortableQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('AutocompleteField', () => {
    it('should create AutocompleteQuestion instance', () => {
      const autocompleteTextarea = `
    <textarea class="govuk-textarea" id="autoCompleteOptions" name="autoCompleteOptions" rows="5" aria-describedby="autoCompleteOptions-hint">Hydrogen:1
Helium:2
</textarea>`
      document.body.innerHTML = buildQuestionStubPanels(
        questionDetailsLeftPanelBuilder(autocompleteTextarea),
        questionDetailsPreviewHTML
      )
      const result = SetupPreview(ComponentType.AutocompleteField)
      expect(result).toBeInstanceOf(AutocompleteQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('ListSortable', () => {
    it('should create ListSortableQuestion instance', () => {
      const result = SetupPreview('ListSortable')
      expect(result).toBeInstanceOf(ListSortableQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('DeclarationField', () => {
    it('should create DeclarationQuestion instance', () => {
      const result = SetupPreview(ComponentType.DeclarationField)
      expect(result).toBeInstanceOf(DeclarationQuestion)
      expect(result).toBeDefined()
    })
  })

  describe('EastingNorthingField', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.EastingNorthingField)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('OsGridRefField', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.OsGridRefField)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('NationalGridFieldNumberField', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.NationalGridFieldNumberField)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })

  describe('LatLongField', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.LatLongField)
      expect(result).toBeDefined()
    })
  })

  describe('HiddenField', () => {
    it('should create Question instance', () => {
      const result = SetupPreview(ComponentType.HiddenField)
      expect(result).toBeInstanceOf(Question)
      expect(result).toBeDefined()
    })
  })
})
