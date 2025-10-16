import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'

/**
 * Defaults for creating new components
 */
export const ComponentTypes: readonly ComponentDef[] = Object.freeze([
  {
    name: 'TextField',
    title: 'Text field',
    type: ComponentType.TextField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'MultilineTextField',
    title: 'Multiline text field',
    type: ComponentType.MultilineTextField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'YesNoField',
    title: 'Yes/No field',
    type: ComponentType.YesNoField,
    hint: '',
    options: {}
  },
  {
    name: 'DatePartsField',
    title: 'Date field',
    type: ComponentType.DatePartsField,
    hint: '',
    options: {}
  },
  {
    name: 'MonthYearField',
    title: 'Month & year field',
    type: ComponentType.MonthYearField,
    hint: '',
    options: {}
  },
  {
    name: 'SelectField',
    title: 'Select field',
    type: ComponentType.SelectField,
    hint: '',
    list: '',
    options: {}
  },
  {
    name: 'AutocompleteField',
    title: 'Autocomplete field',
    type: ComponentType.AutocompleteField,
    hint: '',
    list: '',
    options: {}
  },
  {
    name: 'RadiosField',
    title: 'Radios field',
    type: ComponentType.RadiosField,
    hint: '',
    list: '',
    options: {}
  },
  {
    name: 'CheckboxesField',
    title: 'Checkboxes field',
    type: ComponentType.CheckboxesField,
    hint: '',
    list: '',
    options: {}
  },
  {
    name: 'NumberField',
    title: 'Number field',
    type: ComponentType.NumberField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'UkAddressField',
    title: 'UK address field',
    type: ComponentType.UkAddressField,
    hint: '',
    options: {}
  },
  {
    name: 'TelephoneNumberField',
    title: 'Telephone number field',
    type: ComponentType.TelephoneNumberField,
    hint: '',
    options: {}
  },
  {
    name: 'EmailAddressField',
    title: 'Email address field',
    type: ComponentType.EmailAddressField,
    hint: 'For example, ‘name@example.com’',
    options: {}
  },
  {
    name: 'FileUploadField',
    title: 'File upload field',
    type: ComponentType.FileUploadField,
    options: {},
    schema: {}
  },
  {
    name: 'Html',
    title: 'Html',
    type: ComponentType.Html,
    content: '',
    options: {}
  },
  {
    name: 'InsetText',
    title: 'Inset text',
    type: ComponentType.InsetText,
    content: ''
  },
  {
    name: 'Markdown',
    title: 'Markdown',
    type: ComponentType.Markdown,
    content: '',
    options: {}
  },
  {
    name: 'Details',
    title: 'Details',
    type: ComponentType.Details,
    content: '',
    options: {}
  },
  {
    name: 'List',
    title: 'List',
    type: ComponentType.List,
    list: '',
    options: {}
  },
  {
    name: 'DeclarationField',
    title: 'Declaration',
    type: ComponentType.DeclarationField,
    hint: '',
    content: '',
    options: {}
  }
])
