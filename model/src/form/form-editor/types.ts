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
  questionType: string

  /**
   * The sub-type of written answer
   */
  writtenAnswerSub: string

  /**
   * The sub-type of date
   */
  dateSub: string

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
  | 'question'
  | 'shortDescription'
  | 'hintText'
  | 'questionOptional'
>

export type FormEditorInputPageSettings = Pick<
  FormEditor,
  'pageHeadingAndGuidance' | 'pageHeading' | 'guidanceText'
>
