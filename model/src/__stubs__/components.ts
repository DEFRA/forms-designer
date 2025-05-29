import { ComponentType } from '~/src/components/enums.js'
import {
  type AutocompleteFieldComponent,
  type CheckboxesFieldComponent,
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
  const textFieldComponent: TextFieldComponent = {
    id: '407dd0d7-cce9-4f43-8e1f-7d89cb698875',
    name: 'TextField',
    title: 'Text field',
    type: ComponentType.TextField,
    hint: '',
    options: {},
    schema: {}
  }

  return {
    ...textFieldComponent,
    ...partialTextField
  }
}

/**
 * @param {Partial<FileUploadFieldComponent>} partialFileUploadField
 * @returns {FileUploadFieldComponent}
 */
export function buildFileUploadComponent(
  partialFileUploadField: Partial<FileUploadFieldComponent>
): FileUploadFieldComponent {
  const fileUploadFieldComponent: FileUploadFieldComponent = {
    name: 'FileUploadField',
    type: ComponentType.FileUploadField,
    title: 'File Upload Field',
    options: {},
    schema: {}
  }

  return {
    ...fileUploadFieldComponent,
    ...partialFileUploadField
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
  const autocompleteComponent: AutocompleteFieldComponent = {
    name: 'AutoCompleteField',
    title: 'What languages do you speak?',
    type: ComponentType.AutocompleteField,
    list: 'AutoCompleteList',
    options: {}
  }

  return {
    ...autocompleteComponent,
    ...partialAutoCompleteField
  }
}

/**
 * @param {Partial<RadiosFieldComponent>} partialListComponent
 * @returns {RadiosFieldComponent}
 */
export function buildRadioComponent(
  partialListComponent: Partial<RadiosFieldComponent> = {}
): RadiosFieldComponent {
  const radioFieldComponent: RadiosFieldComponent = {
    name: 'RadioField',
    title: 'Which country do you live in?',
    type: ComponentType.RadiosField,
    list: 'RadioList',
    options: {}
  }

  return {
    ...radioFieldComponent,
    ...partialListComponent
  }
}

/**
 * @param {Partial<CheckboxesFieldComponent>} partialListComponent
 * @returns {CheckboxesFieldComponent}
 */
export function buildCheckboxComponent(
  partialListComponent: Partial<CheckboxesFieldComponent>
): CheckboxesFieldComponent {
  const checkboxesFieldComponent: CheckboxesFieldComponent = {
    name: 'FellowshipOfTheRing',
    title: 'Which are your favourite characters from the fellowship?',
    type: ComponentType.CheckboxesField,
    list: 'CheckboxList',
    options: {}
  }

  return {
    ...checkboxesFieldComponent,
    ...partialListComponent
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
