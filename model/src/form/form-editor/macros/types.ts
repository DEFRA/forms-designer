import { type ComponentType } from '~/src/components/enums.js'
import { type QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
import { type GovukField } from '~/src/form/form-editor/types.js'
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

export interface AppPreviewPanelMacro extends AppPreviewPanelTabsMacro {
  model: QuestionBaseModel
}

export interface PagePreviewComponent {
  model: QuestionBaseModel
  questionType: ComponentType
}

export interface PagePreviewPanelMacro {
  pageTitle: {
    text: string
    classes: string
  }
  components: PagePreviewComponent
}
