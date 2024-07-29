import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'

/**
 * Defaults for creating new components
 */
export const ComponentTypes: ComponentDef[] = [
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
    options: {},
    schema: {}
  },
  {
    name: 'DatePartsField',
    title: 'Date field',
    type: ComponentType.DatePartsField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'MonthYearField',
    title: 'Month & year field',
    type: ComponentType.MonthYearField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'SelectField',
    title: 'Select field',
    type: ComponentType.SelectField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'AutocompleteField',
    title: 'Autocomplete field',
    type: ComponentType.AutocompleteField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'RadiosField',
    title: 'Radios field',
    type: ComponentType.RadiosField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'CheckboxesField',
    title: 'Checkboxes field',
    type: ComponentType.CheckboxesField,
    options: {},
    schema: {},
    list: ''
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
    options: {},
    schema: {}
  },
  {
    name: 'TelephoneNumberField',
    title: 'Telephone number field',
    type: ComponentType.TelephoneNumberField,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'EmailAddressField',
    title: 'Email address field',
    type: ComponentType.EmailAddressField,
    hint: 'For example, ‘name@example.com’',
    options: {},
    schema: {}
  },
  {
    name: 'Html',
    title: 'Html',
    type: ComponentType.Html,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'InsetText',
    title: 'Inset text',
    type: ComponentType.InsetText,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'Details',
    title: 'Details',
    type: ComponentType.Details,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'List',
    title: 'List',
    type: ComponentType.List,
    options: {},
    schema: {},
    list: ''
  }
]
