import {
  buildAutoCompleteComponent,
  buildCheckboxComponent,
  buildDateComponent,
  buildDeclarationFieldComponent,
  buildEastingNorthingFieldComponent,
  buildEmailAddressFieldComponent,
  buildFileUploadComponent,
  buildLatLongFieldComponent,
  buildList,
  buildListComponent,
  buildListItem,
  buildMarkdownComponent,
  buildMonthYearFieldComponent,
  buildMultilineTextFieldComponent,
  buildNationalGridFieldNumberFieldComponent,
  buildNumberFieldComponent,
  buildOsGridRefFieldComponent,
  buildPaymentComponent,
  buildRadiosComponent,
  buildSelectFieldComponent,
  buildTelephoneNumberFieldComponent,
  buildTextFieldComponent,
  buildUkAddressFieldComponent,
  buildYesNoFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage } from '~/src/__stubs__/pages.js'
import { QuestionRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import { AutocompleteListQuestion } from '~/src/form/form-editor/preview/autocomplete.js'
import { CheckboxQuestion } from '~/src/form/form-editor/preview/checkbox.js'
import { DateInputQuestion } from '~/src/form/form-editor/preview/date-input.js'
import { DeclarationQuestion } from '~/src/form/form-editor/preview/declaration.js'
import { EastingNorthingQuestion } from '~/src/form/form-editor/preview/easting-northing.js'
import { EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'
import { mapComponentToPreviewQuestion } from '~/src/form/form-editor/preview/helpers.js'
import { LatLongQuestion } from '~/src/form/form-editor/preview/lat-long.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { MonthYearQuestion } from '~/src/form/form-editor/preview/month-year.js'
import { NationalGridQuestion } from '~/src/form/form-editor/preview/national-grid.js'
import { NumberOnlyQuestion } from '~/src/form/form-editor/preview/number-only.js'
import { OsGridRefQuestion } from '~/src/form/form-editor/preview/os-grid-ref.js'
import { PaymentQuestion } from '~/src/form/form-editor/preview/payment.js'
import { PhoneNumberQuestion } from '~/src/form/form-editor/preview/phone-number.js'
import { RadioQuestion } from '~/src/form/form-editor/preview/radio.js'
import { SelectQuestion } from '~/src/form/form-editor/preview/select.js'
import { ShortAnswerQuestion } from '~/src/form/form-editor/preview/short-answer.js'
import { SupportingEvidenceQuestion } from '~/src/form/form-editor/preview/supporting-evidence.js'
import { UkAddressQuestion } from '~/src/form/form-editor/preview/uk-address.js'
import { YesNoQuestion } from '~/src/form/form-editor/preview/yes-no.js'

describe('helpers', () => {
  const componentContent = {
    title: 'What is your answer?',
    hint: 'hint text'
  }
  const listId = 'f2058740-e744-4e89-b16a-d84112eb385c'
  const listComponentContent = {
    ...componentContent,
    list: listId
  }
  const listItemId1 = 'e9d45883-b3a3-46e9-a44d-0206ce93da23'
  const list = buildList({
    id: listId,
    items: [
      buildListItem({
        id: listItemId1,
        text: 'Item a',
        value: 'item-a'
      }),
      buildListItem({
        text: 'Item b',
        value: 'item-b'
      })
    ]
  })
  const definition = buildDefinition({
    pages: [
      buildQuestionPage({
        components: [buildRadiosComponent(listComponentContent)]
      })
    ],
    lists: [list]
  })

  const renderer = new QuestionRendererStub(jest.fn())
  describe('mapComponentToPreviewQuestion', () => {
    it.each([
      {
        type: 'TextFieldComponent',
        buildComponent: buildTextFieldComponent,
        expected: ShortAnswerQuestion
      },
      {
        type: 'Markdown',
        buildComponent: buildMarkdownComponent,
        expected: Markdown
      },
      {
        type: 'EmailAddressFieldComponent',
        buildComponent: buildEmailAddressFieldComponent,
        expected: EmailAddressQuestion
      },
      {
        type: 'NumberFieldComponent',
        buildComponent: buildNumberFieldComponent,
        expected: NumberOnlyQuestion
      },
      {
        type: 'MultilineTextFieldComponent',
        buildComponent: buildMultilineTextFieldComponent,
        expected: LongAnswerQuestion
      },
      {
        type: 'TelephoneNumberFieldComponent',
        buildComponent: buildTelephoneNumberFieldComponent,
        expected: PhoneNumberQuestion
      },
      {
        type: 'MonthYearFieldComponent',
        buildComponent: buildMonthYearFieldComponent,
        expected: MonthYearQuestion
      },
      {
        type: 'DatePartsFieldComponent',
        buildComponent: buildDateComponent,
        expected: DateInputQuestion
      },
      {
        type: 'UkAddressFieldComponent',
        buildComponent: buildUkAddressFieldComponent,
        expected: UkAddressQuestion
      },
      {
        type: 'YesNoFieldComponent',
        buildComponent: buildYesNoFieldComponent,
        expected: YesNoQuestion
      },
      {
        type: 'FileUploadFieldComponent',
        buildComponent: buildFileUploadComponent,
        expected: SupportingEvidenceQuestion
      },
      {
        type: 'ListComponent',
        buildComponent: buildListComponent,
        expected: ListQuestion
      },
      {
        type: 'DeclarationField',
        buildComponent: buildDeclarationFieldComponent,
        expected: DeclarationQuestion
      },
      {
        type: 'EastingNorthingFieldComponent',
        buildComponent: buildEastingNorthingFieldComponent,
        expected: EastingNorthingQuestion
      },
      {
        type: 'LatLongFieldComponent',
        buildComponent: buildLatLongFieldComponent,
        expected: LatLongQuestion
      },
      {
        type: 'NationalGridFieldNumberFieldComponent',
        buildComponent: buildNationalGridFieldNumberFieldComponent,
        expected: NationalGridQuestion
      },
      {
        type: 'OsGridRefFieldComponent',
        buildComponent: buildOsGridRefFieldComponent,
        expected: OsGridRefQuestion
      },
      {
        type: 'PaymentFieldComponent',
        buildComponent: (/** @type {unknown} */ _content) =>
          buildPaymentComponent({
            title: 'What is your answer?',
            hint: 'hint text',
            options: { amount: 100, description: 'Test payment' }
          }),
        expected: PaymentQuestion
      }
    ])('should map $type', ({ buildComponent, expected }) => {
      const question = buildComponent(componentContent)
      const mapQuestion = mapComponentToPreviewQuestion(
        renderer,
        definition
      )(question)
      expect(mapQuestion).toBeInstanceOf(expected)
      expect(mapQuestion.titleText).toBe('What is your answer?')
    })

    it('should map Autocomplete component', () => {
      const question = buildAutoCompleteComponent(listComponentContent)
      const mapQuestion = mapComponentToPreviewQuestion(
        renderer,
        definition
      )(question)

      expect(mapQuestion).toBeInstanceOf(AutocompleteListQuestion)
      expect(mapQuestion.titleText).toBe('What is your answer?')
      expect(mapQuestion.renderInput.items?.[0]).toEqual({
        hint: undefined,
        id: 'da310b6e-2513-4d14-a7a1-63a93231891d',
        text: '',
        value: ''
      })
      expect(mapQuestion.renderInput.items?.[1]).toEqual({
        hint: undefined,
        id: listItemId1,
        label: {
          classes: '',
          text: 'Item a'
        },
        text: 'Item a',
        value: 'item-a'
      })
    })

    it('should map SelectField component', () => {
      const question = buildSelectFieldComponent(listComponentContent)
      const mapQuestion = mapComponentToPreviewQuestion(
        renderer,
        definition
      )(question)

      expect(mapQuestion).toBeInstanceOf(SelectQuestion)
      expect(mapQuestion.titleText).toBe('What is your answer?')
      expect(mapQuestion.renderInput.items?.[0]).toEqual({
        hint: undefined,
        id: 'da310b6e-2513-4d14-a7a1-63a93231891d',
        label: {
          classes: '',
          text: ''
        },
        text: '',
        value: ''
      })
      expect(mapQuestion.renderInput.items?.[1]).toEqual({
        hint: undefined,
        id: listItemId1,
        label: {
          classes: '',
          text: 'Item a'
        },
        text: 'Item a',
        value: 'item-a'
      })
    })

    it.each([
      {
        type: 'CheckboxesFieldComponent',
        buildComponent: buildCheckboxComponent,
        expected: CheckboxQuestion
      },
      {
        type: 'RadiosFieldComponent',
        buildComponent: buildRadiosComponent,
        expected: RadioQuestion
      }
    ])(
      'should map list component type $type',
      ({ buildComponent, expected }) => {
        const question = buildComponent(listComponentContent)
        const mapQuestion = mapComponentToPreviewQuestion(
          renderer,
          definition
        )(question)
        expect(mapQuestion).toBeInstanceOf(expected)
        expect(mapQuestion.titleText).toBe('What is your answer?')
        expect(mapQuestion.renderInput.items?.[0]).toEqual({
          hint: undefined,
          id: listItemId1,
          label: {
            classes: '',
            text: 'Item a'
          },
          text: 'Item a',
          value: 'item-a'
        })
      }
    )
  })
})
