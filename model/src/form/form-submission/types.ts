import { type FormStatus } from '~/src/common/enums.js'
import {
  type SecurityQuestionsEnum,
  type SubmissionEventMessageCategory,
  type SubmissionEventMessageSchemaVersion,
  type SubmissionEventMessageSource,
  type SubmissionEventMessageType
} from '~/src/form/form-submission/enums.js'
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

/**
 * Interface for the submission-api `/submit` response payload
 */
export interface SubmitResponsePayload {
  message: string
  result: {
    files: {
      main: string
      repeaters: Record<string, string>
    }
  }
}

export interface SaveAndExitMessageData {
  form: {
    id: string
    slug: string
    title: string
    status: FormStatus
    isPreview: boolean
    baseUrl: string
  }
  email: string
  security: {
    question: SecurityQuestionsEnum
    answer: string
  }
  state: object
}

export interface SaveAndExitMessage {
  schemaVersion: SubmissionEventMessageSchemaVersion
  source: SubmissionEventMessageSource
  createdAt: Date
  messageCreatedAt: Date
  category: SubmissionEventMessageCategory.RUNNER
  type: SubmissionEventMessageType.RUNNER_SAVE_AND_EXIT
  data: SaveAndExitMessageData
}

export type RunnerMessage = SaveAndExitMessage

export interface RunnerRecordBase {
  messageId: string
  recordCreatedAt: Date
}

export interface RunnerRecordInputMeta extends RunnerRecordBase {
  id: string
}

export type RunnerRecordInput = RunnerMessage & RunnerRecordBase

export type RunnerRecord = RunnerMessage & RunnerRecordInputMeta
