import {
  formSubmitPayloadSchema,
  formSubmitRecordSchema,
  formSubmitRecordsetSchema
} from '~/src/form/form-submission/index.js'

/**
 * Interface for an individual submit record
 * @see {@link formSubmitRecordSchema}
 */
export interface SubmitRecord {
  /**
   * The field name
   */
  name: string

  /**
   * The field title
   */
  title: string

  /**
   * The field display value
   */
  value: string
}

/**
 * Interface for an individual submit recordset (e.g. a repeater question set)
 * @see {@link formSubmitRecordsetSchema}
 */
export interface SubmitRecordset {
  /**
   * The name of the recordset
   */
  name: string

  /**
   * The title of the recordset
   */
  title: string

  /**
   * The record items
   */
  value: SubmitRecord[][]
}

/**
 * Interface for the submission-api `/submit` payload
 * @see {@link formSubmitPayloadSchema}
 */
export interface SubmitPayload {
  /**
   * The retrieval key for files created in the submission
   */
  retrievalKey: string

  /**
   * The id of the user session
   */
  sessionId: string

  /**
   * The main form anwsers
   */
  main: SubmitRecord[]

  /**
   * The repeaters form answers
   */
  repeaters: SubmitRecordset[]
}
