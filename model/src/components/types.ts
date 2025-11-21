import { type LanguageMessages } from 'joi'

import { type ComponentType } from '~/src/components/enums.js'
import {
  type ListTypeContent,
  type ListTypeOption
} from '~/src/form/form-definition/types.js'

export type ConditionalComponentType = Exclude<
  ConditionalComponentsDef['type'],
  ContentComponentsDef
>

/**
 * Types for Components JSON structure which are expected by engine and turned into actual form input/content/lists
 */

interface FormFieldBase {
  id?: string
  type: FormComponentsDef['type']
  shortDescription?: string
  name: string
  title: string
  hint?: string
  options: {
    required?: boolean
    optionalText?: boolean
    classes?: string
    customValidationMessages?: LanguageMessages
    instructionText?: string
  }
}

interface ListFieldBase extends FormFieldBase {
  type:
    | ComponentType.AutocompleteField
    | ComponentType.CheckboxesField
    | ComponentType.RadiosField
    | ComponentType.SelectField
  list: string
  options: FormFieldBase['options'] & {
    type?: ListTypeContent
  }
}

interface ContentFieldBase {
  id?: string
  type:
    | ComponentType.Details
    | ComponentType.Html
    | ComponentType.Markdown
    | ComponentType.InsetText
    | ComponentType.List
  name: string
  title: string
  options?: {
    required?: undefined
    optionalText?: undefined
  }
}

interface DateFieldBase extends FormFieldBase {
  type: ComponentType.DatePartsField | ComponentType.MonthYearField
  name: string
  title: string
  hint?: string
  options: FormFieldBase['options'] & {
    maxDaysInPast?: number
    maxDaysInFuture?: number
  }
}

// Text Fields
export interface TextFieldComponent extends FormFieldBase {
  type: ComponentType.TextField
  options: FormFieldBase['options'] & {
    autocomplete?: string
    condition?: string
    customValidationMessage?: string
  }
  schema: {
    max?: number
    min?: number
    length?: number
    regex?: string
  }
}

export interface EmailAddressFieldComponent extends FormFieldBase {
  type: ComponentType.EmailAddressField
  options: FormFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface NumberFieldComponent extends FormFieldBase {
  type: ComponentType.NumberField
  options: FormFieldBase['options'] & {
    prefix?: string
    suffix?: string
    autocomplete?: string
    condition?: string
    customValidationMessage?: string
  }
  schema: {
    max?: number
    min?: number
    precision?: number
    minPrecision?: number
    minLength?: number
    maxLength?: number
  }
}

export interface TelephoneNumberFieldComponent extends FormFieldBase {
  type: ComponentType.TelephoneNumberField
  options: FormFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface FileUploadFieldComponent extends FormFieldBase {
  type: ComponentType.FileUploadField
  name: string
  title: string
  hint?: string
  options: FormFieldBase['options'] & {
    accept?: string
  }
  schema: {
    max?: number
    min?: number
    length?: number
  }
}

export interface YesNoFieldComponent extends FormFieldBase {
  type: ComponentType.YesNoField
  options: FormFieldBase['options'] & {
    condition?: string
  }
}

export interface DeclarationFieldComponent extends FormFieldBase {
  type: ComponentType.DeclarationField
  content: string
  options: FormFieldBase['options'] & {
    condition?: string
    declarationConfirmationLabel?: string
  }
}

export interface MultilineTextFieldComponent extends FormFieldBase {
  type: ComponentType.MultilineTextField
  options: FormFieldBase['options'] & {
    autocomplete?: string
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

export interface UkAddressFieldComponent extends FormFieldBase {
  type: ComponentType.UkAddressField
  options: FormFieldBase['options'] & {
    hideTitle?: boolean
    usePostcodeLookup?: boolean
  }
}

// Precise Location Fields
export interface EastingNorthingFieldComponent extends FormFieldBase {
  type: ComponentType.EastingNorthingField
  options: FormFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
  schema?: {
    easting?: {
      min?: number
      max?: number
    }
    northing?: {
      min?: number
      max?: number
    }
  }
}

export interface OsGridRefFieldComponent extends FormFieldBase {
  type: ComponentType.OsGridRefField
  options: FormFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface NationalGridFieldNumberFieldComponent extends FormFieldBase {
  type: ComponentType.NationalGridFieldNumberField
  options: FormFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
}

export interface LatLongFieldComponent extends FormFieldBase {
  type: ComponentType.LatLongField
  options: FormFieldBase['options'] & {
    condition?: string
    customValidationMessage?: string
  }
  schema?: {
    latitude?: {
      min?: number
      max?: number
    }
    longitude?: {
      min?: number
      max?: number
    }
  }
}

export interface HiddenFieldComponent extends FormFieldBase {
  type: ComponentType.HiddenField
  options: FormFieldBase['options'] & {
    condition?: string
  }
}

// Date Fields
export interface DatePartsFieldComponent extends DateFieldBase {
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
  content: string
  options: ContentFieldBase['options'] & {
    condition?: string
  }
}

export interface HtmlComponent extends ContentFieldBase {
  type: ComponentType.Html
  content: string
  options: ContentFieldBase['options'] & {
    condition?: string
  }
}

export interface MarkdownComponent extends ContentFieldBase {
  type: ComponentType.Markdown
  content: string
  options: ContentFieldBase['options'] & {
    condition?: string
  }
}

export interface InsetTextComponent extends ContentFieldBase {
  type: ComponentType.InsetText
  content: string
}

export interface ListComponent extends ContentFieldBase {
  type: ComponentType.List
  hint?: string
  list: string
  options: ContentFieldBase['options'] & {
    type?: ListTypeOption
    classes?: string
    hideTitle?: boolean
    bold?: boolean
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
    bold?: boolean
    condition?: string
  }
}

export interface RadiosFieldComponent extends ListFieldBase {
  type: ComponentType.RadiosField
  options: ListFieldBase['options'] & {
    bold?: boolean
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

export type ComponentDef = FormComponentsDef | ContentComponentsDef

// Components that render form fields
export type FormComponentsDef =
  | InputFieldsComponentsDef
  | SelectionComponentsDef

// Components that render inputs
export type InputFieldsComponentsDef =
  | TextFieldComponent
  | EmailAddressFieldComponent
  | NumberFieldComponent
  | MultilineTextFieldComponent
  | TelephoneNumberFieldComponent
  | MonthYearFieldComponent
  | DatePartsFieldComponent
  | UkAddressFieldComponent
  | FileUploadFieldComponent
  | DeclarationFieldComponent
  | EastingNorthingFieldComponent
  | OsGridRefFieldComponent
  | NationalGridFieldNumberFieldComponent
  | LatLongFieldComponent
  | HiddenFieldComponent

// Components that render content
export type ContentComponentsDef =
  | DetailsComponent
  | HtmlComponent
  | MarkdownComponent
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
  | FileUploadFieldComponent
>
