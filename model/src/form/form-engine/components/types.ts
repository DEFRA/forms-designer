import { type ComponentType } from '~/src/components/enums.js'
import { type Item } from '~/src/form/form-definition/types.js'
import {
  type FormSubmissionError,
  type FormValue,
  type SummaryList
} from '~/src/form/form-engine/types.js'

export type ComponentText = {
  classes?: string
  attributes?: string | Record<string, string>
} & (
  | {
      text: string
      html?: string
    }
  | {
      text?: string
      html: string
    }
)

export interface Label {
  text: string
  classes?: string
  html?: string
  isPageHeading?: boolean
}

export interface Content {
  title?: string
  text: string
  condition?: string
}

export interface BackLink {
  text: string
  href: string
}

export type ListItemLabel = Omit<Label, 'text' | 'isPageHeading'>

export interface ListItem {
  text?: string
  value?: Item['value']
  hint?: {
    id?: string
    text: string
  }
  checked?: boolean
  selected?: boolean
  label?: ListItemLabel
  condition?: string
}

export interface DateInputItem {
  label?: Label
  type?: string
  id?: string
  name?: string
  value?: Item['value']
  classes?: string
  condition?: undefined
}

export interface ViewModel extends Record<string, unknown> {
  label?: Label
  type?: string
  id?: string
  name?: string
  value?: FormValue
  hint?: {
    id?: string
    text: string
  }
  prefix?: ComponentText
  suffix?: ComponentText
  classes?: string
  condition?: string
  errors?: FormSubmissionError[]
  errorMessage?: {
    text: string
  }
  summaryHtml?: string
  html?: string
  attributes: {
    autocomplete?: string
    maxlength?: number
    multiple?: string
    accept?: string
    inputmode?: string
  }
  content?: Content | Content[] | string
  maxlength?: number
  maxwords?: number
  rows?: number
  items?: ListItem[] | DateInputItem[]
  fieldset?: {
    attributes?: string | Record<string, string>
    legend?: Label
  }
  formGroup?: {
    classes?: string
    attributes?: string | Record<string, string>
  }
  components?: ComponentViewModel[]
  upload?: {
    count: number
    summaryList: SummaryList
  }
}

export interface ComponentViewModel {
  type: ComponentType
  isFormComponent: boolean
  model: ViewModel
}

export interface DatePartsState extends Record<string, number> {
  day: number
  month: number
  year: number
}

export interface MonthYearState extends Record<string, number> {
  month: number
  year: number
}

export interface UkAddressState extends Record<string, string> {
  addressLine1: string
  addressLine2: string
  town: string
  county: string
  postcode: string
}
