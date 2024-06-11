import {
  type ComponentSubType,
  type ComponentType
} from '~/src/components/enums.js'

export type ConditionalComponentType = Extract<
  ComponentType,
  | typeof ComponentType.CheckboxesField
  | typeof ComponentType.DateField
  | typeof ComponentType.DatePartsField
  | typeof ComponentType.DateTimeField
  | typeof ComponentType.DateTimePartsField
  | typeof ComponentType.EmailAddressField
  | typeof ComponentType.MultilineTextField
  | typeof ComponentType.NumberField
  | typeof ComponentType.TextField
  | typeof ComponentType.TimeField
  | typeof ComponentType.YesNoField
>

export interface ContentOptions {
  condition?: string
}

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
    | ComponentType.WebsiteField
    | ComponentType.YesNoField
  subType?: ComponentSubType.Field
  name: string
  title: string
  hint?: string
  options: {
    hideTitle?: boolean
    required?: boolean
    optionalText?: boolean
    classes?: string
    allow?: string
    autocomplete?: string
    exposeToContext?: boolean
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
  subType?: ComponentSubType.Field
  name: string
  title: string
  hint: string
  options: {
    prefix?: string
    suffix?: string
    exposeToContext?: boolean
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
  subType?: ComponentSubType.Content | ComponentSubType.ListField
  name: string
  title: string
  options: {
    type?: string
    hideTitle?: boolean
    required?: boolean
    optionalText?: boolean
    classes?: string
    bold?: boolean
    exposeToContext?: boolean
    allowPrePopulation?: boolean
  }
  list: string
  schema: object
}

interface ContentFieldBase {
  type: ComponentType.Details | ComponentType.Html | ComponentType.InsetText
  subType?: ComponentSubType.Content
  name: string
  title: string
  content: string
  options: ContentOptions
  schema?: object
}

interface DateFieldBase {
  type:
    | ComponentType.DateField
    | ComponentType.DatePartsField
    | ComponentType.DateTimeField
    | ComponentType.DateTimePartsField
    | ComponentType.MonthYearField
    | ComponentType.TimeField
  subType?: ComponentSubType.Field
  name: string
  title: string
  hint: string
  options: {
    hideTitle?: boolean
    required?: boolean
    optionalText?: boolean
    maxDaysInFuture?: number
    maxDaysInPast?: number
    exposeToContext?: boolean
  }
  schema: object
}

// Text Fields
export interface TextFieldComponent extends TextFieldBase {
  type: ComponentType.TextField
  options: TextFieldBase['options'] & {
    customValidationMessage?: string
  }
}

export interface EmailAddressFieldComponent extends TextFieldBase {
  type: ComponentType.EmailAddressField
}

export interface NumberFieldComponent extends NumberFieldBase {
  type: ComponentType.NumberField
}

export interface WebsiteFieldComponent extends TextFieldBase {
  type: ComponentType.WebsiteField
  options: TextFieldBase['options'] & {
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
}

export interface MultilineTextFieldComponent extends TextFieldBase {
  type: ComponentType.MultilineTextField
  options: TextFieldBase['options'] & {
    customValidationMessage?: string
    rows?: number
    maxWords?: number
  }
  schema: {
    max?: number
    min?: number
  }
}

export interface FileUploadFieldComponent {
  type: ComponentType.FileUploadField
  subType?: ComponentSubType.Field
  name: string
  title: string
  hint: string
  options: {
    required?: boolean
    hideTitle?: boolean
    multiple?: boolean
    classes?: string
    exposeToContext?: boolean
    imageQualityPlayback?: boolean
  }
  schema: object
}

export interface UkAddressFieldComponent extends TextFieldBase {
  type: ComponentType.UkAddressField
}

// Date Fields
export interface DateFieldComponent extends DateFieldBase {
  type: ComponentType.DateField
}

export interface DateTimeFieldComponent extends DateFieldBase {
  type: ComponentType.DateTimeField
}

export interface DatePartsFieldFieldComponent extends DateFieldBase {
  type: ComponentType.DatePartsField
}

export interface MonthYearFieldComponent extends DateFieldBase {
  type: ComponentType.MonthYearField
}

export interface DateTimePartsFieldComponent extends DateFieldBase {
  type: ComponentType.DateTimePartsField
}

export interface TimeFieldComponent extends DateFieldBase {
  type: ComponentType.TimeField
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
  subType?: ComponentSubType.ListField
}

export interface CheckboxesFieldComponent extends ListFieldBase {
  type: ComponentType.CheckboxesField
  subType?: ComponentSubType.ListField
}

export interface RadiosFieldComponent extends ListFieldBase {
  type: ComponentType.RadiosField
  subType?: ComponentSubType.ListField
}

export interface SelectFieldComponent extends ListFieldBase {
  type: ComponentType.SelectField
  subType?: ComponentSubType.ListField
  options: ListFieldBase['options'] & { autocomplete?: string }
}

export type ComponentDef =
  | InsetTextComponent
  | AutocompleteFieldComponent
  | CheckboxesFieldComponent
  | DateFieldComponent
  | DatePartsFieldFieldComponent
  | MonthYearFieldComponent
  | DateTimeFieldComponent
  | DateTimePartsFieldComponent
  | DetailsComponent
  | EmailAddressFieldComponent
  | FileUploadFieldComponent
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
  | WebsiteFieldComponent

// Components that render inputs.
export type InputFieldsComponentsDef =
  | TextFieldComponent
  | EmailAddressFieldComponent
  | NumberFieldComponent
  | MultilineTextFieldComponent
  | TelephoneNumberFieldComponent
  | YesNoFieldComponent
  | FileUploadFieldComponent
  | DateFieldComponent
  | DateTimeFieldComponent
  | DateTimePartsFieldComponent
  | MonthYearFieldComponent
  | TimeFieldComponent
  | UkAddressFieldComponent
  | WebsiteFieldComponent

// Components that render content.
export type ContentComponentsDef =
  | DetailsComponent
  | HtmlComponent
  | InsetTextComponent
  | ListComponent

// Components that render Lists
export type ListComponentsDef =
  | ListComponent
  | AutocompleteFieldComponent
  | CheckboxesFieldComponent
  | RadiosFieldComponent
  | SelectFieldComponent

// Components that have custom condition operators
export type ConditionalComponentsDef =
  | CheckboxesFieldComponent
  | DateFieldComponent
  | DatePartsFieldFieldComponent
  | DateTimeFieldComponent
  | DateTimePartsFieldComponent
  | EmailAddressFieldComponent
  | MultilineTextFieldComponent
  | NumberFieldComponent
  | TextFieldComponent
  | TimeFieldComponent
  | YesNoFieldComponent
