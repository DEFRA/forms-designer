import { ComponentSubType, ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'

/**
 * Defaults for creating new components
 */
export const ComponentTypes: ComponentDef[] = [
  {
    name: 'TextField',
    title: 'Text field',
    type: ComponentType.TextField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'MultilineTextField',
    title: 'Multiline text field',
    type: ComponentType.MultilineTextField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'YesNoField',
    title: 'Yes/No field',
    type: ComponentType.YesNoField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'TimeField',
    title: 'Time field',
    type: ComponentType.TimeField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'DatePartsField',
    title: 'Date field',
    type: ComponentType.DatePartsField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'MonthYearField',
    title: 'Month & year field',
    type: ComponentType.MonthYearField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'SelectField',
    title: 'Select field',
    type: ComponentType.SelectField,
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'AutocompleteField',
    title: 'Autocomplete field',
    type: ComponentType.AutocompleteField,
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'RadiosField',
    title: 'Radios field',
    type: ComponentType.RadiosField,
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'CheckboxesField',
    title: 'Checkboxes field',
    type: ComponentType.CheckboxesField,
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'NumberField',
    title: 'Number field',
    type: ComponentType.NumberField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'UkAddressField',
    title: 'UK address field',
    type: ComponentType.UkAddressField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'TelephoneNumberField',
    title: 'Telephone number field',
    type: ComponentType.TelephoneNumberField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'EmailAddressField',
    title: 'Email address field',
    type: ComponentType.EmailAddressField,
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'Html',
    title: 'Html',
    type: ComponentType.Html,
    subType: ComponentSubType.Content,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'InsetText',
    title: 'Inset text',
    type: ComponentType.InsetText,
    subType: ComponentSubType.Content,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'Details',
    title: 'Details',
    type: ComponentType.Details,
    subType: ComponentSubType.Content,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'List',
    title: 'List',
    type: ComponentType.List,
    subType: ComponentSubType.Content,
    options: {},
    schema: {},
    list: ''
  }
]
