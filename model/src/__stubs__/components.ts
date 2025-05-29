import { ComponentType } from '~/src/components/enums.js'
import {
  type AutocompleteFieldComponent,
  type CheckboxesFieldComponent,
  type DatePartsFieldComponent,
  type FileUploadFieldComponent,
  type NumberFieldComponent,
  type RadiosFieldComponent,
  type TextFieldComponent
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
  partialAutoCompleteField: Partial<AutocompleteFieldComponent>
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
  partialListComponent: Partial<CheckboxesFieldComponent>
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
  partialComponent: Partial<NumberFieldComponent>
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
  partialComponent: Partial<DatePartsFieldComponent>
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
  partialComponent: Partial<RadiosFieldComponent>
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
