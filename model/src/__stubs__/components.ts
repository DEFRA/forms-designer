import { ComponentType } from '~/src/components/enums.js'
import {
  type AutocompleteFieldComponent,
  type CheckboxesFieldComponent,
  type DatePartsFieldComponent,
  type DeclarationFieldComponent,
  type DetailsComponent,
  type EmailAddressFieldComponent,
  type FileUploadFieldComponent,
  type HtmlComponent,
  type InsetTextComponent,
  type ListComponent,
  type MarkdownComponent,
  type MonthYearFieldComponent,
  type MultilineTextFieldComponent,
  type NumberFieldComponent,
  type RadiosFieldComponent,
  type SelectFieldComponent,
  type TelephoneNumberFieldComponent,
  type TextFieldComponent,
  type UkAddressFieldComponent,
  type YesNoFieldComponent
} from '~/src/components/types.js'
import { type Item, type List } from '~/src/form/form-definition/types.js'

/**
 * @param {Partial<TextFieldComponent>} partialTextField
 * @returns {TextFieldComponent}
 */
export function buildTextFieldComponent(
  partialTextField: Partial<TextFieldComponent> = {}
): TextFieldComponent {
  return {
    id: '407dd0d7-cce9-4f43-8e1f-7d89cb698875',
    name: 'TextField',
    title: 'Text field',
    hint: '',
    options: {},
    schema: {},
    ...partialTextField,
    type: ComponentType.TextField
  }
}

export function buildMultilineTextFieldComponent(
  partialMultilineTextField: Partial<MultilineTextFieldComponent> = {}
): MultilineTextFieldComponent {
  return {
    id: '72671f23-552e-4504-a06a-693e240880d5',
    name: 'MuTeCo',
    options: {},
    schema: {},
    title: 'Multiline TextField Component',
    ...partialMultilineTextField,
    type: ComponentType.MultilineTextField
  }
}

export function buildYesNoFieldComponent(
  partialYesNoField: Partial<YesNoFieldComponent> = {}
): YesNoFieldComponent {
  return {
    title: 'YesNo Field Component',
    id: 'be7f849c-47d8-4f1f-ba15-ab939dc70914',
    name: 'YesNoFieldComponent',
    options: {},
    ...partialYesNoField,
    type: ComponentType.YesNoField
  }
}

export function buildDeclarationFieldComponent(
  partialDeclarationField: Partial<DeclarationFieldComponent> = {}
): DeclarationFieldComponent {
  return {
    title: 'Declaration',
    id: 'f2a8c9e1-3d4f-4b5a-8c6d-1e2f3a4b5c6d',
    name: 'DeclarationFieldComponent',
    content: '',
    options: {},
    ...partialDeclarationField,
    type: ComponentType.DeclarationField
  }
}
export function buildMonthYearFieldComponent(
  partialMonthYearField: Partial<MonthYearFieldComponent> = {}
): MonthYearFieldComponent {
  return {
    id: 'd4e99aca-6d13-4c1a-a623-9e9e5b27d46d',
    title: 'MonthYearFieldComponent',
    name: 'MonthYearFieldComponent',
    options: {},
    ...partialMonthYearField,
    type: ComponentType.MonthYearField
  }
}
export function buildSelectFieldComponent(
  partialSelectField: Partial<SelectFieldComponent> = {}
): SelectFieldComponent {
  return {
    id: '7f219cf6-3e16-4549-b8df-789506682147',
    list: '',
    name: '',
    options: {},
    title: '',
    ...partialSelectField,
    type: ComponentType.SelectField
  }
}
export function buildUkAddressFieldComponent(
  partialUkAddressField: Partial<UkAddressFieldComponent> = {}
): UkAddressFieldComponent {
  return {
    id: 'a7cb7440-9095-44cd-9136-2914232722c8',
    title: 'UkAddressFieldComponent',
    name: 'UkAddressFieldComponent',
    options: {},
    ...partialUkAddressField,
    type: ComponentType.UkAddressField
  }
}
export function buildTelephoneNumberFieldComponent(
  partialTelephoneNumberField: Partial<TelephoneNumberFieldComponent> = {}
): TelephoneNumberFieldComponent {
  return {
    id: '69907916-beac-4faa-b469-656dad5edced',
    title: 'TelephoneNumberFieldComponent',
    name: 'TelephoneNumberFieldComponent',
    options: {},
    ...partialTelephoneNumberField,
    type: ComponentType.TelephoneNumberField
  }
}
export function buildEmailAddressFieldComponent(
  partialEmailAddressField: Partial<EmailAddressFieldComponent> = {}
): EmailAddressFieldComponent {
  return {
    id: '9dcf0781-bf34-48c8-b13b-d13050dc34d9',
    title: 'EmailAddressFieldComponent',
    name: 'EmailAddressFieldComponent',
    options: {},
    ...partialEmailAddressField,
    type: ComponentType.EmailAddressField
  }
}

export function buildHtmlComponent(
  partialHtml: Partial<HtmlComponent> = {}
): HtmlComponent {
  return {
    id: 'bac683ce-149e-4740-95aa-8289b35bc327',
    title: 'HtmlComponent',
    name: 'HtmlComponent',
    options: {},
    content: '',
    ...partialHtml,
    type: ComponentType.Html
  }
}
export function buildInsetTextComponent(
  partialInsetText: Partial<InsetTextComponent> = {}
): InsetTextComponent {
  return {
    id: '6b717151-1e86-42b2-97a9-2201b0676e47',
    title: 'InsetText Component',
    name: 'InsetTextComponent',
    content: '',
    options: {},
    ...partialInsetText,
    type: ComponentType.InsetText
  }
}
export function buildDetailsComponent(
  partialDetails: Partial<DetailsComponent> = {}
): DetailsComponent {
  return {
    id: '245d54df-bb1e-488e-82f6-8f1e42c197e6',
    title: 'Details Component',
    name: 'DetailsComponent',
    content: '',
    options: {},
    ...partialDetails,
    type: ComponentType.Details
  }
}
export function buildListComponent(
  partialList: Partial<ListComponent> = {}
): ListComponent {
  return {
    id: '62f17168-c2ef-4978-bd42-bdaa5704e25f',
    title: 'List Component',
    name: 'ListComponent',
    list: '',
    options: {},
    ...partialList,
    type: ComponentType.List
  }
}
export function buildMarkdownComponent(
  partialMarkdown: Partial<MarkdownComponent> = {}
): MarkdownComponent {
  return {
    id: '4a2dc88c-be1a-4277-aff8-04220de2e778',
    title: 'Markdown Component',
    name: 'MarkdownComponent',
    options: {},
    content: '',
    ...partialMarkdown,
    type: ComponentType.Markdown
  }
}

/**
 * @param {Partial<FileUploadFieldComponent>} partialFileUploadField
 * @returns {FileUploadFieldComponent}
 */
export function buildFileUploadComponent(
  partialFileUploadField: Partial<FileUploadFieldComponent> = {}
): FileUploadFieldComponent {
  return {
    name: 'FileUploadField',
    title: 'File Upload Field',
    options: {},
    schema: {},
    ...partialFileUploadField,
    type: ComponentType.FileUploadField
  }
}

/**
 *
 * @param {Partial<AutocompleteFieldComponent>} partialAutoCompleteField
 * @returns {AutocompleteFieldComponent}
 */
export function buildAutoCompleteComponent(
  partialAutoCompleteField: Partial<AutocompleteFieldComponent> = {}
): AutocompleteFieldComponent {
  return {
    name: 'AutoCompleteField',
    title: 'What languages do you speak?',
    list: 'AutoCompleteList',
    options: {},
    ...partialAutoCompleteField,
    type: ComponentType.AutocompleteField
  }
}

/**
 * @param {Partial<RadiosFieldComponent>} partialListComponent
 * @returns {RadiosFieldComponent}
 */
export function buildRadioComponent(
  partialListComponent: Partial<RadiosFieldComponent> = {}
): RadiosFieldComponent {
  return {
    id: '34455d57-df37-4b69-a64f-6c3af0317ebe',
    name: 'RadioField',
    title: 'Which country do you live in?',
    list: 'RadioList',
    options: {},
    ...partialListComponent,
    type: ComponentType.RadiosField
  }
}

/**
 * @param {Partial<CheckboxesFieldComponent>} partialListComponent
 * @returns {CheckboxesFieldComponent}
 */
export function buildCheckboxComponent(
  partialListComponent: Partial<CheckboxesFieldComponent> = {}
): CheckboxesFieldComponent {
  return {
    name: 'FellowshipOfTheRing',
    title: 'Which are your favourite characters from the fellowship?',
    list: 'CheckboxList',
    options: {},
    ...partialListComponent,
    type: ComponentType.CheckboxesField
  }
}

/**
 * Builder to create a stub List item
 * @param {Partial<Item>} partialListItem
 * @returns {Item}
 */
export function buildListItem(partialListItem: Partial<Item> = {}): Item {
  return {
    text: 'Javascript',
    value: 'javascript',
    ...partialListItem
  }
}

/**
 * @param {Partial<List>} partialList
 * @returns {List}
 */
export function buildList(partialList: Partial<List> = {}): List {
  return {
    title: 'Development language2',
    name: 'YhmNDD',
    type: 'string',
    items: [
      buildListItem({
        text: 'Javascript',
        value: 'javascript'
      }),
      buildListItem({
        text: 'TypeScript',
        value: 'typescript'
      }),
      buildListItem({
        text: 'Python',
        value: 'python'
      }),
      buildListItem({
        text: 'Haskell',
        value: 'haskell'
      }),
      buildListItem({
        text: 'Erlang',
        value: 'erlang'
      }),
      buildListItem({
        text: 'Java',
        value: 'java'
      })
    ],
    ...partialList
  }
}

export function buildNumberFieldComponent(
  partialComponent: Partial<NumberFieldComponent> = {}
): NumberFieldComponent {
  return {
    name: 'year',
    title: 'Year',
    options: {},
    schema: {},
    ...partialComponent,
    type: ComponentType.NumberField
  }
}

export function buildDateComponent(
  partialComponent: Partial<DatePartsFieldComponent> = {}
): DatePartsFieldComponent {
  return {
    name: 'bcdefg',
    title: 'Default title',
    options: {},
    ...partialComponent,
    type: ComponentType.DatePartsField
  }
}

export function buildRadiosComponent(
  partialComponent: Partial<RadiosFieldComponent> = {}
): RadiosFieldComponent {
  return {
    name: 'cdefgh',
    title: 'Default title',
    options: {},
    list: 'Default list Id ref',
    ...partialComponent,
    type: ComponentType.RadiosField
  }
}
