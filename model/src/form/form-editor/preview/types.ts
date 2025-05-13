import {
  type ListElement,
  type ListItemReadonly
} from '~/src/form/form-editor/types.js'

export interface BaseSettings {
  question: string
  hintText: string
  optional: boolean
  shortDesc: string
  items: ListElement[]
}

export interface DefaultComponent {
  id?: string
  text: string
  classes: string
}

export interface GovukFieldset {
  legend: DefaultComponent
}

export interface QuestionBaseModel {
  id?: string
  name?: string
  label?: DefaultComponent
  hint?: DefaultComponent
  fieldset?: GovukFieldset
  readonly items?: ListItemReadonly[]
  text?: string
  formGroup?: { afterInputs: { html: string } }
}

export type ListenerRow = [
  HTMLInputElement | null,
  (target: HTMLInputElement, e: Event) => void,
  keyof HTMLElementEventMap
]

export interface QuestionElements {
  readonly values: BaseSettings
  setPreviewHTML(value: string): void
}

export interface RenderContext {
  model: QuestionBaseModel
}

export interface HTMLBuilder {
  buildHTML(questionTemplate: string, renderContext: RenderContext): string
}

export interface QuestionRenderer {
  render(questionTemplate: string, questionBaseModel: QuestionBaseModel): void
}

export interface ListElements extends QuestionElements {
  afterInputsHTML: string
}
