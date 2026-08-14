import {
  formDefinitionWithFormLevelDeclaration,
  formDefinitionWithLocationAndDeclaration,
  formDefinitionWithRadioQuestion,
  formDefinitionWithRepeater,
  formDefinitionWithTwoQuestionsAndGuidance
} from '~/src/__stubs__/examples.js'
import {
  buildComponent,
  buildTranslationDataRows
} from '~/src/form/form-editor/translations/translations.js'
import {
  buildHtmlComponent,
  buildMetaData,
  buildPaymentComponent,
  buildTextFieldComponent
} from '~/src/stubs.js'

describe('translations', () => {
  const metadata = buildMetaData({
    contact: {
      phone: '0123456789',
      email: {
        address: 'my-email@server.com',
        responseTime: 'Response is 2 days'
      },
      online: {
        url: 'https://contact-link.com',
        text: 'My link text'
      }
    },
    submissionGuidance: 'My submission guidance text',
    privacyNoticeType: 'text',
    privacyNoticeText: 'Privacy notice text'
  })

  describe('buildTranslationsDataRows', () => {
    it('should return full list of data values with no welsh yet', () => {
      const definition = structuredClone(
        formDefinitionWithTwoQuestionsAndGuidance
      )
      const res = buildTranslationDataRows(metadata, definition)

      expect(res.overviewRows).toHaveLength(8)
      expect(res.formRows).toHaveLength(8)

      expect(res.overviewRows[0].englishContent).toBe('Test form')
      expect(res.overviewRows[0].welshContent).toBe('')
      expect(res.overviewRows[0].name).toBe('form.title')

      expect(res.formRows[0].englishContent).toBe('Page One')
      expect(res.formRows[0].welshContent).toBe('')
      expect(res.formRows[0].name).toBe('pages.p1.title')

      expect(res.formRows[1].englishContent).toBe('My markdown text')
      expect(res.formRows[1].welshContent).toBe('')
      expect(res.formRows[1].name).toBe(
        'components.4a2dc88c-be1a-4277-aff8-04220de2e778.content'
      )
    })

    it('should return full list of data values for location components', () => {
      const definition = structuredClone(
        formDefinitionWithLocationAndDeclaration
      )
      const res = buildTranslationDataRows(metadata, definition)

      expect(res.overviewRows).toHaveLength(8)
      expect(res.formRows).toHaveLength(9)

      expect(res.overviewRows[0].englishContent).toBe('Test form')
      expect(res.overviewRows[0].welshContent).toBe('')
      expect(res.overviewRows[0].name).toBe('form.title')

      expect(res.formRows[0].englishContent).toBe('Page One')
      expect(res.formRows[0].welshContent).toBe('')
      expect(res.formRows[0].name).toBe('pages.p1.title')

      expect(res.formRows[1].englishContent).toBe(
        'This is the first lat long field question'
      )
      expect(res.formRows[1].welshContent).toBe('')
      expect(res.formRows[1].name).toBe('components.q1.title')

      expect(res.formRows[2].englishContent).toBe('Hint text')
      expect(res.formRows[2].welshContent).toBe('')
      expect(res.formRows[2].name).toBe('components.q1.hint')

      expect(res.formRows[4].englishContent).toBe('Some instruction text')
      expect(res.formRows[4].welshContent).toBe('')
      expect(res.formRows[4].name).toBe('components.q1.instructionText')

      expect(res.formRows[5].englishContent).toBe(
        'This is a declaration question'
      )
      expect(res.formRows[5].welshContent).toBe('')
      expect(res.formRows[5].name).toBe('components.q2.title')

      expect(res.formRows[6].englishContent).toBe('Declaration hint text')
      expect(res.formRows[6].welshContent).toBe('')
      expect(res.formRows[6].name).toBe('components.q2.hint')

      expect(res.formRows[7].englishContent).toBe('Declaration short desc')
      expect(res.formRows[7].welshContent).toBe('')
      expect(res.formRows[7].name).toBe('components.q2.shortDescription')

      expect(res.formRows[8].englishContent).toBe(
        'This is the declaration that needs agreeing to'
      )
      expect(res.formRows[8].welshContent).toBe('')
      expect(res.formRows[8].name).toBe('components.q2.content')
    })

    it('should handle a form-level declaration', () => {
      const definition = structuredClone(formDefinitionWithFormLevelDeclaration)
      const res = buildTranslationDataRows(metadata, definition)

      expect(res.overviewRows).toHaveLength(8)
      expect(res.formRows).toHaveLength(8)

      expect(res.overviewRows[0].englishContent).toBe('Test form')
      expect(res.overviewRows[0].welshContent).toBe('')
      expect(res.overviewRows[0].name).toBe('form.title')

      expect(res.formRows[0].englishContent).toBe('Page One')
      expect(res.formRows[0].welshContent).toBe('')
      expect(res.formRows[0].name).toBe('pages.p1.title')

      expect(res.formRows[1].englishContent).toBe(
        'This is the first textfield question'
      )
      expect(res.formRows[1].welshContent).toBe('')
      expect(res.formRows[1].name).toBe('components.q1.title')

      expect(res.formRows[2].englishContent).toBe('Hint text 1')
      expect(res.formRows[2].welshContent).toBe('')
      expect(res.formRows[2].name).toBe('components.q1.hint')

      expect(res.formRows[3].englishContent).toBe('Short desc 1')
      expect(res.formRows[3].welshContent).toBe('')
      expect(res.formRows[3].name).toBe('components.q1.shortDescription')

      expect(res.formRows[4].englishContent).toBe(
        'This is the second textfield question'
      )
      expect(res.formRows[4].welshContent).toBe('')
      expect(res.formRows[4].name).toBe('components.q2.title')

      expect(res.formRows[5].englishContent).toBe('Hint text 2')
      expect(res.formRows[5].welshContent).toBe('')
      expect(res.formRows[5].name).toBe('components.q2.hint')

      expect(res.formRows[6].englishContent).toBe('Short desc 2')
      expect(res.formRows[6].welshContent).toBe('')
      expect(res.formRows[6].name).toBe('components.q2.shortDescription')

      expect(res.formRows[7].englishContent).toBe(
        'This is a final declaration for the summary page'
      )
      expect(res.formRows[7].welshContent).toBe('')
      expect(res.formRows[7].name).toBe('components.q10.content')
    })

    it('should handle repeater page', () => {
      const definition = structuredClone(formDefinitionWithRepeater)
      const res = buildTranslationDataRows(metadata, definition)

      expect(res.overviewRows).toHaveLength(8)
      expect(res.formRows).toHaveLength(5)

      expect(res.overviewRows[0].englishContent).toBe('Test form')
      expect(res.overviewRows[0].welshContent).toBe('')
      expect(res.overviewRows[0].name).toBe('form.title')

      expect(res.formRows[0].englishContent).toBe('Repeater Page')
      expect(res.formRows[0].welshContent).toBe('')
      expect(res.formRows[0].name).toBe('pages.p1.title')

      expect(res.formRows[1].englishContent).toBe('Simple question responses')
      expect(res.formRows[1].welshContent).toBe('')
      expect(res.formRows[1].name).toBe('pages.p1.repeatTitle')

      expect(res.formRows[2].englishContent).toBe(
        'This is the first text field field question'
      )
      expect(res.formRows[2].welshContent).toBe('')
      expect(res.formRows[2].name).toBe('components.q1.title')

      expect(res.formRows[3].englishContent).toBe('Hint text')
      expect(res.formRows[3].welshContent).toBe('')
      expect(res.formRows[3].name).toBe('components.q1.hint')

      expect(res.formRows[4].englishContent).toBe('Short desc')
      expect(res.formRows[4].welshContent).toBe('')
      expect(res.formRows[4].name).toBe('components.q1.shortDescription')
    })

    it('should return full list of data values with welsh translations', () => {
      const definition = structuredClone(formDefinitionWithRadioQuestion)
      definition.metadata = {
        translations: {
          cy: {
            'form.title': 'Welsh form title',
            'pages.p1.title': 'Welsh page one',
            'listItems.option-1.text': 'Welsh option 1',
            'listItems.option-1.hint': 'Welsh option 1 hint',
            'listItems.option-2.text': 'Welsh option 2',
            'listItems.option-2.hint': 'Welsh option 2 hint',
            'listItems.option-3.text': 'Welsh option 3'
          }
        }
      }
      const res = buildTranslationDataRows(metadata, definition)

      expect(res.overviewRows).toHaveLength(8)
      expect(res.formRows).toHaveLength(10)

      expect(res.overviewRows[0].englishContent).toBe('Test form')
      expect(res.overviewRows[0].welshContent).toBe('Welsh form title')
      expect(res.overviewRows[0].name).toBe('form.title')

      expect(res.formRows[0].englishContent).toBe('Page One')
      expect(res.formRows[0].welshContent).toBe('Welsh page one')
      expect(res.formRows[0].name).toBe('pages.p1.title')

      expect(res.formRows[4].englishContent).toBe('Option 1')
      expect(res.formRows[4].welshContent).toBe('Welsh option 1')
      expect(res.formRows[4].name).toBe('listItems.option-1.text')

      expect(res.formRows[5].englishContent).toBe('Option 1 hint')
      expect(res.formRows[5].welshContent).toBe('Welsh option 1 hint')
      expect(res.formRows[5].name).toBe('listItems.option-1.hint')

      expect(res.formRows[6].englishContent).toBe('Option 2')
      expect(res.formRows[6].welshContent).toBe('Welsh option 2')
      expect(res.formRows[6].name).toBe('listItems.option-2.text')

      expect(res.formRows[7].englishContent).toBe('Option 2 hint')
      expect(res.formRows[7].welshContent).toBe('Welsh option 2 hint')
      expect(res.formRows[7].name).toBe('listItems.option-2.hint')

      expect(res.formRows[8].englishContent).toBe('Option 3')
      expect(res.formRows[8].welshContent).toBe('Welsh option 3')
      expect(res.formRows[8].name).toBe('listItems.option-3.text')

      expect(res.formRows[9].englishContent).toBe('Option 3 hint')
      expect(res.formRows[9].welshContent).toBe('')
      expect(res.formRows[9].name).toBe('listItems.option-3.hint')
    })
  })

  describe('buildComponent', () => {
    it('should return empty array if not an included field', () => {
      const definition = structuredClone(
        formDefinitionWithTwoQuestionsAndGuidance
      )
      const res = buildComponent(
        definition,
        buildHtmlComponent(),
        1,
        1,
        {},
        undefined
      )
      expect(res).toHaveLength(0)
    })

    it('should build payment field', () => {
      const definition = structuredClone(
        formDefinitionWithTwoQuestionsAndGuidance
      )
      const res = buildComponent(
        definition,
        buildPaymentComponent(),
        1,
        1,
        {},
        undefined
      )
      expect(res).toHaveLength(1)
      expect(res[0]).toEqual({
        englishContent: 'Payment description',
        itemNum: undefined,
        label: 'Welsh payment description - Page 1, question 1',
        name: 'components.undefined.paymentDescription',
        pageNum: 1,
        questionNum: 1,
        type: 'PaymentDescription',
        welshContent: ''
      })
    })

    it('should add error description', () => {
      const definition = structuredClone(
        formDefinitionWithTwoQuestionsAndGuidance
      )
      const component = buildTextFieldComponent({
        id: 'comp-id-1',
        shortDescription: 'My short desc',
        errorDescription: 'My error desc'
      })

      const res = buildComponent(definition, component, 1, 1, {}, undefined)
      expect(res).toHaveLength(3)
      expect(res[0]).toEqual({
        englishContent: 'Text field',
        itemNum: undefined,
        label: 'Welsh question text - Page 1, question 1',
        name: 'components.comp-id-1.title',
        pageNum: 1,
        questionNum: 1,
        type: 'QuestionText',
        welshContent: ''
      })
      expect(res[1]).toEqual({
        englishContent: 'My short desc',
        itemNum: undefined,
        label: 'Welsh short description - Page 1, question 1',
        name: 'components.comp-id-1.shortDescription',
        pageNum: 1,
        questionNum: 1,
        type: 'ShortDescription',
        welshContent: ''
      })
      expect(res[2]).toEqual({
        englishContent: 'My error desc',
        itemNum: undefined,
        label: 'Welsh error description - Page 1, question 1',
        name: 'components.comp-id-1.errorDescription',
        pageNum: 1,
        questionNum: 1,
        type: 'ErrorDescription',
        welshContent: ''
      })
    })
  })
})

/**
 * @import { TextFieldComponent } from '~/src/components/types.js'
 */
