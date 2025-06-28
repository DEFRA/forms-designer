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
  formGroup?: { afterInputs: { html: string } }
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
}
