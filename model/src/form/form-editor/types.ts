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
   * The sub-type of lists
   */
  listSub: string

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
   * The number of rows of a textarea
   */
  rows: string

  /**
   * The classes to be applied to a field
   */
  classes: string

  /**
   * The prefix to be applied to a field
   */
  prefix: string

  /**
   * The suffix to be applied to a field
   */
  suffix: string

  /**
   * The decimal precision of a number field
   */
  precision: string

  /**
   * The lowest number allowed in a field
   */
  min: string

  /**
   * The highest number allowed in a field
   */
  max: string

  /**
   * The maximum days in the future to allow for a date
   */
  maxFuture: string

  /**
   * The maximum days in the past to allow for a date
   */
  maxPast: string

  /**
   * The exact number of files to upload
   */
  exactFiles: string

  /**
   * The minimum number of files to upload
   */
  minFiles: string

  /**
   * The maximum number of files to upload
   */
  maxFiles: string

  /**
   * The type of files for upload
   */
  fileTypes: string[]

  /**
   * The types of document files for upload
   */
  documentTypes: string[]

  /**
   * The types of image files for upload
   */
  imageTypes: string[]

  /**
   * The types of tabular data files for upload
   */
  tabularDataTypes: string[]
}

export type FormEditorInputPage = Pick<
  FormEditor,
  'pageType' | 'questionType' | 'writtenAnswerSub' | 'dateSub' | 'listSub'
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
  | 'rows'
  | 'classes'
  | 'prefix'
  | 'suffix'
  | 'precision'
  | 'min'
  | 'max'
  | 'maxFuture'
  | 'maxPast'
  | 'exactFiles'
  | 'minFiles'
  | 'maxFiles'
  | 'fileTypes'
  | 'documentTypes'
  | 'imageTypes'
  | 'tabularDataTypes'
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
  fieldset?: {
    legend?: { text?: string; isPageHeading?: boolean; classes?: string }
  }
  value?: string | boolean | number | string[]
  classes?: string
  label?: { text?: string; html?: string; classes?: string }
  hint?: { text?: string; html?: string; classes?: string }
  items?: { text?: string; value?: string; checked?: boolean }[]
  rows?: number
  type?: string
}

export interface FormEditorGovukField {
  question?: GovukField
  hintText?: GovukField
  questionOptional?: GovukField
  shortDescription?: GovukField
  fileTypes?: GovukField
  documentTypes?: GovukField
  imageTypes?: GovukField
  tabularDataTypes?: GovukField
  errorMessage?: { text: string }
}

export interface FormEditorCheckbox {
  text?: string
  hint?: {
    text?: string
  }
  value?: string
  divider?: {
    text?: string
    hint?: string
    value?: string
  }
}
