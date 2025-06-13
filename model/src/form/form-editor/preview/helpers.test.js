import {
  buildAutoCompleteComponent,
  buildCheckboxComponent,
  buildDateComponent,
  buildEmailAddressFieldComponent,
  buildFileUploadComponent,
  buildList,
  buildListItem,
  buildMonthYearFieldComponent,
  buildMultilineTextFieldComponent,
  buildNumberFieldComponent,
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
import { EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'
import { mapComponentToPreviewQuestion } from '~/src/form/form-editor/preview/helpers.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'
import { MonthYearQuestion } from '~/src/form/form-editor/preview/month-year.js'
import { NumberOnlyQuestion } from '~/src/form/form-editor/preview/number-only.js'
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

    it.each([
      {
        type: 'Autocomplete',
        buildComponent: buildAutoCompleteComponent,
        expected: AutocompleteListQuestion
      },
      {
        type: 'CheckboxesFieldComponent',
        buildComponent: buildCheckboxComponent,
        expected: CheckboxQuestion
      },
      {
        type: 'RadiosFieldComponent',
        buildComponent: buildRadiosComponent,
        expected: RadioQuestion
      },
      {
        type: 'SelectFieldComponent',
        buildComponent: buildSelectFieldComponent,
        expected: SelectQuestion
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
