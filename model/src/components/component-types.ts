import { ComponentSubType, ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'

export const ComponentTypes: ComponentDef[] = [
  {
    name: 'TextField',
    type: ComponentType.TextField,
    title: 'Text field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'MultilineTextField',
    type: ComponentType.MultilineTextField,
    title: 'Multiline text field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'YesNoField',
    type: ComponentType.YesNoField,
    title: 'Yes/No field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'TimeField',
    type: ComponentType.TimeField,
    title: 'Time field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'DatePartsField',
    type: ComponentType.DatePartsField,
    title: 'Date field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'MonthYearField',
    type: ComponentType.MonthYearField,
    title: 'Month & year field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'SelectField',
    type: ComponentType.SelectField,
    title: 'Select field',
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'AutocompleteField',
    type: ComponentType.AutocompleteField,
    title: 'Autocomplete field',
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'RadiosField',
    type: ComponentType.RadiosField,
    title: 'Radios field',
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'CheckboxesField',
    type: ComponentType.CheckboxesField,
    title: 'Checkboxes field',
    subType: ComponentSubType.ListField,
    options: {},
    schema: {},
    list: ''
  },
  {
    name: 'NumberField',
    type: ComponentType.NumberField,
    title: 'Number field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'UkAddressField',
    type: ComponentType.UkAddressField,
    title: 'UK address field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'TelephoneNumberField',
    type: ComponentType.TelephoneNumberField,
    title: 'Telephone number field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'EmailAddressField',
    type: ComponentType.EmailAddressField,
    title: 'Email address field',
    subType: ComponentSubType.Field,
    hint: '',
    options: {},
    schema: {}
  },
  {
    name: 'Html',
    type: ComponentType.Html,
    title: 'Html',
    subType: ComponentSubType.Content,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'InsetText',
    type: ComponentType.InsetText,
    title: 'Inset text',
    subType: ComponentSubType.Content,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'Details',
    type: ComponentType.Details,
    title: 'Details',
    subType: ComponentSubType.Content,
    content: '',
    options: {},
    schema: {}
  },
  {
    name: 'List',
    type: ComponentType.List,
    title: 'List',
    subType: ComponentSubType.Content,
    options: {},
    schema: {},
    list: ''
  }
]
