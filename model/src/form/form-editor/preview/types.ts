import {
  type PagePreviewPanelMacro,
  type QuestionBaseModel
} from '~/src/form/form-editor/macros/types.js'
import { type AutocompleteQuestion } from '~/src/form/form-editor/preview/autocomplete.js'
import { type DateInputQuestion } from '~/src/form/form-editor/preview/date-input.js'
import { type EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'
import { type ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { type LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'
import { type PhoneNumberQuestion } from '~/src/form/form-editor/preview/phone-number.js'
import { type Question } from '~/src/form/form-editor/preview/question.js'
import { type RadioSortableQuestion } from '~/src/form/form-editor/preview/radio-sortable.js'
import { type SelectSortableQuestion } from '~/src/form/form-editor/preview/select-sortable.js'
import { type ShortAnswerQuestion } from '~/src/form/form-editor/preview/short-answer.js'
import { type UkAddressQuestion } from '~/src/form/form-editor/preview/uk-address.js'
import { type ListElement } from '~/src/form/form-editor/types.js'
export { type QuestionBaseModel } from '~/src/form/form-editor/macros/types.js'
export interface BaseSettings {
  largeTitle: boolean
  question: string
  hintText: string
  optional: boolean
  shortDesc: string
  items: ListElement[]
  content: string
}

export interface DefaultComponent {
  id?: string
  text: string
  classes: string
}

export interface GovukFieldset {
  legend: DefaultComponent
}

export type ListenerRow = [
  HTMLInputElement | null,
  (target: HTMLInputElement, e: Event) => void,
  keyof HTMLElementEventMap
]

export interface DomElementsBase {
  readonly values?: BaseSettings
  autocompleteOptions?: string
  setPreviewHTML(value: string): void
  setPreviewDOM(element: HTMLElement): void
}

export interface QuestionElements extends DomElementsBase {
  readonly values: BaseSettings
}

export interface AutocompleteElements extends QuestionElements {
  autocompleteOptions: string
}

export interface QuestionRenderContext {
  model: QuestionBaseModel
}

export type RenderContext = QuestionRenderContext | PagePreviewPanelMacro

export interface HTMLBuilder {
  buildHTML(questionTemplate: string, renderContext: RenderContext): string
}

export interface QuestionRenderer {
  render(questionTemplate: string, questionBaseModel: QuestionBaseModel): void
}

export interface PageRenderer {
  render(pageTemplate: string, pagePreview: PagePreviewPanelMacro): void
}

export type Renderer = QuestionRenderer | PageRenderer

export interface ListElements extends QuestionElements {
  afterInputsHTML: string
}

export interface PageOverviewElements {
  heading: string
  guidance: string
}

export type PreviewQuestion =
  | DateInputQuestion
  | EmailAddressQuestion
  | ListSortableQuestion
  | LongAnswerQuestion
  | PhoneNumberQuestion
  | Question
  | RadioSortableQuestion
  | SelectSortableQuestion
  | ShortAnswerQuestion
  | UkAddressQuestion
  | AutocompleteQuestion
