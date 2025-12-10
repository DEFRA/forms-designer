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
  question: string
  hintText: string
  optional: boolean
  shortDesc: string
  userClasses: string
  items: ListElement[]
  content: string
  attributes?: Record<string, string>
}

export interface DefaultComponent {
  id?: string
  text: string
  classes: string
  isPageHeading?: boolean
}

export interface GovukFieldset {
  legend: DefaultComponent
}

export type ListenerRow = [
  HTMLInputElement | HTMLTextAreaElement | null,
  (target: HTMLInputElement | HTMLTextAreaElement, e: Event) => void,
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

export interface NumberSettings extends BaseSettings {
  prefix: string
  suffix: string
}

export interface DeclarationSettings extends BaseSettings {
  declarationText: string
}

export interface DeclarationElements extends DomElementsBase {
  readonly values: DeclarationSettings
}

export interface UkAddressSettings extends BaseSettings {
  usePostcodeLookup?: boolean
}

export interface UkAddressElements extends DomElementsBase {
  readonly values: UkAddressSettings
}

export interface NumberElements extends DomElementsBase {
  readonly values: NumberSettings
}

export interface MultilineTextFieldSettings extends BaseSettings {
  maxLength: number
  rows: number
}

export interface MultilineTextFieldElements extends DomElementsBase {
  readonly values: MultilineTextFieldSettings
}

export interface LocationSettings extends BaseSettings {
  instructionText: string
}

export interface LocationElements extends DomElementsBase {
  readonly values: LocationSettings
}

export interface LocationFieldModel extends QuestionBaseModel {
  userClasses: string
  fieldset: {
    legend: {
      text: string
      classes: string
    }
  }
  instructionText: string
  details: {
    classes: string
  }
}

export interface RenderBase {
  render(questionTemplate: string, renderContext: RenderContext): void
}

export interface QuestionRenderContext {
  model: QuestionBaseModel
}

export interface PageRenderContext {
  params: PagePreviewPanelMacro
}

export type RenderContext = QuestionRenderContext | PageRenderContext

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

export interface PagePreviewBaseElements {
  heading: string
  guidance: string
}

export interface PageSectionInfo {
  title: string
  hideTitle: boolean
}

export interface PageOverviewElements extends PagePreviewBaseElements {
  addHeading: boolean
  repeatQuestion: string | undefined
  hasRepeater: boolean
  section?: PageSectionInfo
}

export interface SectionForPreview {
  name: string
  title: string
  pages: { title: string }[]
}

export interface SummaryPageElements extends PagePreviewBaseElements {
  declaration: boolean
  showConfirmationEmail: boolean
  isConfirmationEmailSettingsPanel: boolean
  sections?: SectionForPreview[]
  unassignedPages?: { title: string }[]
}

export interface SummaryPageInitialState {
  showConfirmationEmail: boolean
  declarationText: string
  needDeclaration: boolean
  isConfirmationEmailSettingsPanel: boolean
  sections?: SectionForPreview[]
  unassignedPages?: { title: string }[]
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
