/**
 * Interface for `formMetadataSchema` Joi schema
 * @see {@link formEditorSchema}
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
  questionOptional: boolean

  /**
   * The short description of the question
   */
  shortDescription: string
}

export type FormEditorInput = Pick<FormEditor, 'pageType' | 'questionType'>
