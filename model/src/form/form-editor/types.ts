/**
 * Interface for `FormEditor` Joi schema
 */
export interface FormEditor {
  /**
   * The type of the page
   */
  pageType: string

  /**
   * The type of the question
   */
  questionType: string | undefined

  /**
   * The sub-type of written answer
   */
  writtenAnswerSub: string

  /**
   * The sub-type of date
   */
  dateSub: string

  /**
   * The name of the question (unique id)
   */
  name: string

  /**
   * The text of the question
   */
  question: string

  /**
   * The hint text of the question
   */
  hintText: string

  /**
   * Denotes if the question is optional
   */
  questionOptional: string

  /**
   * The short description of the question
   */
  shortDescription: string

  /**
   * The value of checkbox to reveal heading and guidance section
   */
  pageHeadingAndGuidance: string

  /**
   * The page heading
   */
  pageHeading: string

  /**
   * The page guidance text
   */
  guidanceText: string

  /**
   * The value of radio to reveal declaration text field
   */
  needDeclaration: string

  /**
   * The check answers declaration text
   */
  declarationText: string

  /**
   * The min length a field can have
   */
  minLength: string

  /**
   * The max length a field can have
   */
  maxLength: string

  /**
   * The regex value of a field
   */
  regex: string

  /**
   * The classes to be applied to a field
   */
  classes: string
}

export type FormEditorInputPage = Pick<
  FormEditor,
  'pageType' | 'questionType' | 'writtenAnswerSub' | 'dateSub'
>

export type FormEditorInputCheckAnswersSettings = Pick<
  FormEditor,
  'needDeclaration' | 'declarationText'
>

export type FormEditorInputQuestion = Pick<
  FormEditor,
  | 'questionType'
  | 'name'
  | 'question'
  | 'shortDescription'
  | 'hintText'
  | 'questionOptional'
  | 'minLength'
  | 'maxLength'
  | 'regex'
  | 'classes'
>

export type FormEditorInputPageSettings = Pick<
  FormEditor,
  'pageHeadingAndGuidance' | 'pageHeading' | 'guidanceText'
>

export type FormEditorInputGuidancePage = Pick<
  FormEditor,
  'pageHeading' | 'guidanceText'
>

export interface GovukField {
  id?: string
  name?: string
  idPrefix?: string
  value?: string | boolean | number
  classes?: string
  label?: { text?: string; html?: string; classes?: string }
  hint?: { text?: string; html?: string; classes?: string }
  items?: { text?: string; value?: string }
  rows?: number
  type?: string
}

export interface FormEditorGovukField {
  question?: GovukField
  hintText?: GovukField
  questionOptional?: GovukField
  shortDescription?: GovukField
  minLength?: GovukField
  maxLength?: GovukField
  regex?: GovukField
  classes?: GovukField
  errorMessage?: { text: string }
}
