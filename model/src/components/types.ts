import { type ComponentType } from '~/src/components/enums.js'

export type ConditionalComponentType = Exclude<
  ConditionalComponentsDef['type'],
  ContentComponentsDef
>

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
  hint?: string
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
  type: ComponentType.DatePartsField | ComponentType.MonthYearField
  name: string
  title: string
  hint?: string
  options: {
    required?: boolean
    optionalText?: boolean
    maxDaysInPast?: number
    maxDaysInFuture?: number
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
    condition?: string
    customValidationMessage?: string
  }
}

export interface FileUploadFieldComponent {
  type: ComponentType.FileUploadField
  name: string
  title: string
  hint?: string
  options: {
    required?: boolean
    optionalText?: boolean
    classes?: string
    accept?: string
    autocomplete?: string
    customValidationMessage?: string
  }
  schema: {
    max?: number
    min?: number
    length?: number
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
  options: ListFieldBase['options'] & {
    hideTitle?: boolean
  }
}

export interface AutocompleteFieldComponent extends ListFieldBase {
  type: ComponentType.AutocompleteField
  options: ListFieldBase['options'] & {
    condition?: string
  }
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
  | InputFieldsComponentsDef
  | SelectionComponentsDef
  | ContentComponentsDef

// Components that render inputs
export type InputFieldsComponentsDef =
  | TextFieldComponent
  | EmailAddressFieldComponent
  | NumberFieldComponent
  | MultilineTextFieldComponent
  | TelephoneNumberFieldComponent
  | MonthYearFieldComponent
  | DatePartsFieldFieldComponent
  | UkAddressFieldComponent
  | FileUploadFieldComponent

// Components that render content
export type ContentComponentsDef =
  | DetailsComponent
  | HtmlComponent
  | InsetTextComponent
  | ListComponent

// Components that render lists
export type ListComponentsDef =
  | Exclude<SelectionComponentsDef, YesNoFieldComponent>
  | ListComponent

// Components that have selection fields
export type SelectionComponentsDef =
  | AutocompleteFieldComponent
  | CheckboxesFieldComponent
  | RadiosFieldComponent
  | SelectFieldComponent
  | YesNoFieldComponent

// Components that have condition support
export type ConditionalComponentsDef = Exclude<
  ComponentDef,
  | InsetTextComponent
  | ListComponent
  | MonthYearFieldComponent
  | UkAddressFieldComponent
>
