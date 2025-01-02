import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import randomId from '~/src/utils/randomId.js'

/**
 * Defaults for creating new components
 */
export const ComponentTypes: readonly ComponentDef[] = Object.freeze([
  {
    id: randomId(),
    name: 'TextField',
    title: 'Text field',
    type: ComponentType.TextField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    id: randomId(),
    name: 'MultilineTextField',
    title: 'Multiline text field',
    type: ComponentType.MultilineTextField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    id: randomId(),
    name: 'YesNoField',
    title: 'Yes/No field',
    type: ComponentType.YesNoField,
    hint: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'DatePartsField',
    title: 'Date field',
    type: ComponentType.DatePartsField,
    hint: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'MonthYearField',
    title: 'Month & year field',
    type: ComponentType.MonthYearField,
    hint: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'SelectField',
    title: 'Select field',
    type: ComponentType.SelectField,
    hint: '',
    list: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'AutocompleteField',
    title: 'Autocomplete field',
    type: ComponentType.AutocompleteField,
    hint: '',
    list: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'RadiosField',
    title: 'Radios field',
    type: ComponentType.RadiosField,
    hint: '',
    list: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'CheckboxesField',
    title: 'Checkboxes field',
    type: ComponentType.CheckboxesField,
    hint: '',
    list: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'NumberField',
    title: 'Number field',
    type: ComponentType.NumberField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    id: randomId(),
    name: 'UkAddressField',
    title: 'UK address field',
    type: ComponentType.UkAddressField,
    hint: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'TelephoneNumberField',
    title: 'Telephone number field',
    type: ComponentType.TelephoneNumberField,
    hint: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'EmailAddressField',
    title: 'Email address field',
    type: ComponentType.EmailAddressField,
    hint: 'For example, ‘name@example.com’',
    options: {}
  },
  {
    id: randomId(),
    name: 'FileUploadField',
    title: 'File upload field',
    type: ComponentType.FileUploadField,
    options: {},
    schema: {}
  },
  {
    id: randomId(),
    name: 'Html',
    title: 'Html',
    type: ComponentType.Html,
    content: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'InsetText',
    title: 'Inset text',
    type: ComponentType.InsetText,
    content: ''
  },
  {
    id: randomId(),
    name: 'Details',
    title: 'Details',
    type: ComponentType.Details,
    content: '',
    options: {}
  },
  {
    id: randomId(),
    name: 'List',
    title: 'List',
    type: ComponentType.List,
    list: '',
    options: {}
  }
])
