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
import {
  type DateItem,
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
  readonly items?: ListItemReadonly[] | DateItem[]
  text?: string
  formGroup?: { afterInputs: { html: string } }
  type?: 'text' | 'number' | 'boolean'
}

export type ListenerRow = [
  HTMLInputElement | null,
  (target: HTMLInputElement, e: Event) => void,
  keyof HTMLElementEventMap
]

export interface QuestionElements {
  readonly values: BaseSettings
  setPreviewHTML(value: string): void
  setPreviewDOM(element: HTMLElement): void
}
export interface AutocompleteElements extends QuestionElements {
  autocompleteOptions: string
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
