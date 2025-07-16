import { type ComponentType } from '~/src/components/enums.js'
import {
  type DateItem,
  type GovukField,
  type ListItemReadonly
} from '~/src/form/form-editor/types.js'
import { type DefaultComponent, type GovukFieldset } from '~/src/index.js'

export interface AppPreviewErrorPanelMacroErrorTemplate {
  advancedSettingsErrors: []
  baseErrors: { template: unknown; type: string }[]
}

export interface AppPreviewErrorPanelMacro {
  errorTemplates: AppPreviewErrorPanelMacroErrorTemplate
  fieldDetails: {
    extraFields: GovukField[]
    basePageFields: GovukField[]
  }
  questionType: ComponentType
}

export interface AppPreviewPanelTabsMacro {
  questionType: ComponentType
  previewPageUrl: string
  previewErrorsUrl: string
  errorTemplates: AppPreviewErrorPanelMacroErrorTemplate
  extraFields: GovukField[]
  basePageFields: GovukField[]
}

export interface SelectAfterInput {
  afterInput: { html: string }
}
export interface RadioAndCheckboxAfterInputs {
  afterInputs: { html: string }
}

// GDS components - Select uses afterInput, while Radio uses afterInputs
export type FormGroupAfterInput = SelectAfterInput | RadioAndCheckboxAfterInputs

export interface QuestionBaseModel {
  id?: string
  name?: string
  content?: string
  attributes?: Record<string, string>
  label?: DefaultComponent
  hint?: DefaultComponent
  fieldset?: GovukFieldset
  readonly items?: ListItemReadonly[] | DateItem[]
  text?: string
  formGroup?: FormGroupAfterInput
  type?: 'text' | 'number' | 'boolean'
  classes?: string
}

export interface AppPreviewPanelMacro extends AppPreviewPanelTabsMacro {
  model: QuestionBaseModel
}

export interface PagePreviewComponent {
  model: QuestionBaseModel
  questionType: ComponentType
}

export interface PagePreviewPanelMacro {
  readonly pageTitle: {
    text: string
    classes: string
  }
  readonly guidance: {
    text: string
    classes: string
  }
  readonly components: PagePreviewComponent[]
  readonly sectionTitle?: {
    text: string
    classes: string
  }
  readonly repeaterButton?: {
    text: string
    classes: string
  }
}

export interface SummaryRowActionItem {
  href: string
  text: string
  visuallyHiddenText: string
}

export interface SummaryRow {
  key: { text: string }
  value: { text: string }
  actions: {
    items: SummaryRowActionItem[]
  }
}
