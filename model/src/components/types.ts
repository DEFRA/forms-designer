import { type ComponentType } from '~/src/components/enums.js'

export type ConditionalComponentType =
  | ComponentType.RadiosField
  | ComponentType.CheckboxesField
  | ComponentType.DatePartsField
  | ComponentType.EmailAddressField
  | ComponentType.MultilineTextField
  | ComponentType.NumberField
  | ComponentType.SelectField
  | ComponentType.TextField
  | ComponentType.TimeField
  | ComponentType.YesNoField

/**
 * Types for Components JSON structure which are expected by engine and turned into actual form input/content/lists
 */
interface TextFieldBase {
  type:
    | ComponentType.EmailAddressField
    | ComponentType.MultilineTextField
    | ComponentType.NumberField
    | ComponentType.TelephoneNumberField
    | ComponentType.TextField
    | ComponentType.UkAddressField
    | ComponentType.YesNoField
  name: string
  title: string
  hint?: string
  options: {
    required?: boolean
    optionalText?: boolean
    classes?: string
    allow?: string
    autocomplete?: string
  }
  schema: {
    max?: number
    min?: number
    length?: number
    regex?: string
    error?: unknown
  }
}

interface NumberFieldBase {
  type: ComponentType
  name: string
  title: string
  hint?: string
  options: {
    required?: boolean
    optionalText?: boolean
    classes?: string
    prefix?: string
    suffix?: string
  }
  schema: {
    min?: number
    max?: number
    precision?: number
  }
}

interface ListFieldBase {
  type:
    | ComponentType.AutocompleteField
    | ComponentType.CheckboxesField
    | ComponentType.List
    | ComponentType.RadiosField
    | ComponentType.SelectField
  name: string
  title: string
  options: {
    type?: string
    required?: boolean
    optionalText?: boolean
    classes?: string
    bold?: boolean
  }
  list: string
  schema: object
}

interface ContentFieldBase {
  type: ComponentType.Details | ComponentType.Html | ComponentType.InsetText
  name: string
  title: string
  content: string
  options: {
    condition?: string
  }
  schema: object
}

interface DateFieldBase {
  type:
    | ComponentType.DatePartsField
    | ComponentType.MonthYearField
    | ComponentType.TimeField
  name: string
  title: string
  hint?: string
  options: {
    required?: boolean
    optionalText?: boolean
    maxDaysInFuture?: number
    maxDaysInPast?: number
  }
  schema: object
}

// Text Fields
export interface TextFieldComponent extends TextFieldBase {
  type: ComponentType.TextField
  options: TextFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface EmailAddressFieldComponent extends TextFieldBase {
  type: ComponentType.EmailAddressField
  options: TextFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface NumberFieldComponent extends NumberFieldBase {
  type: ComponentType.NumberField
  options: NumberFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface TelephoneNumberFieldComponent extends TextFieldBase {
  type: ComponentType.TelephoneNumberField
  options: TextFieldBase['options'] & {
    customValidationMessage?: string
  }
}

export interface YesNoFieldComponent extends TextFieldBase {
  type: ComponentType.YesNoField
  options: TextFieldBase['options'] & {
    condition?: string
  }
}

export interface MultilineTextFieldComponent extends TextFieldBase {
  type: ComponentType.MultilineTextField
  options: TextFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
    rows?: number
    maxWords?: number
  }
  schema: {
    max?: number
    min?: number
    length?: number
    regex?: string
  }
}

export interface UkAddressFieldComponent extends TextFieldBase {
  type: ComponentType.UkAddressField
  options: TextFieldBase['options'] & {
    hideTitle?: boolean
  }
}

// Date Fields
export interface DatePartsFieldFieldComponent extends DateFieldBase {
  type: ComponentType.DatePartsField
  options: DateFieldBase['options'] & {
    condition?: string
  }
}

export interface MonthYearFieldComponent extends DateFieldBase {
  type: ComponentType.MonthYearField
  options: DateFieldBase['options'] & {
    customValidationMessage?: string
  }
}

export interface TimeFieldComponent extends DateFieldBase {
  type: ComponentType.TimeField
  options: DateFieldBase['options'] & {
    condition?: string
  }
}

// Content Fields
export interface DetailsComponent extends ContentFieldBase {
  type: ComponentType.Details
}

export interface HtmlComponent extends ContentFieldBase {
  type: ComponentType.Html
}

export interface InsetTextComponent extends ContentFieldBase {
  type: ComponentType.InsetText
}

// List Fields
export interface ListComponent extends ListFieldBase {
  type: ComponentType.List
}

export interface AutocompleteFieldComponent extends ListFieldBase {
  type: ComponentType.AutocompleteField
}

export interface CheckboxesFieldComponent extends ListFieldBase {
  type: ComponentType.CheckboxesField
  options: ListFieldBase['options'] & {
    condition?: string
  }
}

export interface RadiosFieldComponent extends ListFieldBase {
  type: ComponentType.RadiosField
  options: ListFieldBase['options'] & {
    condition?: string
  }
}

export interface SelectFieldComponent extends ListFieldBase {
  type: ComponentType.SelectField
  options: ListFieldBase['options'] & {
    autocomplete?: string
    condition?: string
  }
}

export type ComponentDef =
  | InsetTextComponent
  | AutocompleteFieldComponent
  | CheckboxesFieldComponent
  | DatePartsFieldFieldComponent
  | MonthYearFieldComponent
  | DetailsComponent
  | EmailAddressFieldComponent
  | HtmlComponent
  | ListComponent
  | MultilineTextFieldComponent
  | NumberFieldComponent
  | RadiosFieldComponent
  | SelectFieldComponent
  | TelephoneNumberFieldComponent
  | TextFieldComponent
  | TimeFieldComponent
  | UkAddressFieldComponent
  | YesNoFieldComponent

// Components that render inputs
export type InputFieldsComponentsDef =
  | TextFieldComponent
  | EmailAddressFieldComponent
  | NumberFieldComponent
  | MultilineTextFieldComponent
  | TelephoneNumberFieldComponent
  | YesNoFieldComponent
  | MonthYearFieldComponent
  | TimeFieldComponent
  | DatePartsFieldFieldComponent
  | UkAddressFieldComponent

// Components that render content
export type ContentComponentsDef =
  | DetailsComponent
  | HtmlComponent
  | InsetTextComponent

// Components with editors
export type EditorComponentsDef =
  | TextFieldComponent
  | EmailAddressFieldComponent
  | TelephoneNumberFieldComponent
  | MultilineTextFieldComponent
  | NumberFieldComponent
  | AutocompleteFieldComponent
  | SelectFieldComponent
  | RadiosFieldComponent
  | CheckboxesFieldComponent
  | ListComponent
  | DetailsComponent
  | HtmlComponent
  | InsetTextComponent
  | DatePartsFieldFieldComponent

// Components that render lists
export type ListComponentsDef =
  | ListComponent
  | AutocompleteFieldComponent
  | CheckboxesFieldComponent
  | RadiosFieldComponent
  | SelectFieldComponent

// Components that have selection fields
export type SelectionComponentsDef =
  | CheckboxesFieldComponent
  | RadiosFieldComponent
  | SelectFieldComponent
  | YesNoFieldComponent

// Components that have custom condition operators
export type ConditionalComponentsDef =
  | CheckboxesFieldComponent
  | DatePartsFieldFieldComponent
  | EmailAddressFieldComponent
  | MultilineTextFieldComponent
  | NumberFieldComponent
  | TextFieldComponent
  | TimeFieldComponent
  | YesNoFieldComponent
