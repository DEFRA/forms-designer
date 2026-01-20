export enum ComponentType {
  TextField = 'TextField',
  MultilineTextField = 'MultilineTextField',
  YesNoField = 'YesNoField',
  DatePartsField = 'DatePartsField',
  MonthYearField = 'MonthYearField',
  SelectField = 'SelectField',
  AutocompleteField = 'AutocompleteField',
  RadiosField = 'RadiosField',
  CheckboxesField = 'CheckboxesField',
  NumberField = 'NumberField',
  UkAddressField = 'UkAddressField',
  TelephoneNumberField = 'TelephoneNumberField',
  EmailAddressField = 'EmailAddressField',
  Html = 'Html',
  InsetText = 'InsetText',
  Details = 'Details',
  List = 'List',
  Markdown = 'Markdown',
  FileUploadField = 'FileUploadField',
  DeclarationField = 'DeclarationField',
  EastingNorthingField = 'EastingNorthingField',
  OsGridRefField = 'OsGridRefField',
  NationalGridFieldNumberField = 'NationalGridFieldNumberField',
  LatLongField = 'LatLongField',
  HiddenField = 'HiddenField',
  PaymentField = 'PaymentField'
}

export const PreviewTypeEnum = {
  ...ComponentType,
  Question: 'Question',
  ListSortable: 'ListSortable'
} as Record<string, string>
