import { type FormStatus } from '~/src/common/enums.js'
import { type OutputAudience } from '~/src/form/form-definition/types.js'
import {
  type ConditionEvaluationOutcome,
  type SecurityQuestionsEnum,
  type SubmissionEventMessageCategory,
  type SubmissionEventMessageSchemaVersion,
  type SubmissionEventMessageSource,
  type SubmissionEventMessageType
} from '~/src/form/form-submission/enums.js'
import {
  formSubmitConditionEvaluationSchema,
  formSubmitConditionReferenceSchema,
  formSubmitNotificationTargetSchema,
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
 * A component referenced by a condition, and whether the user had answered it
 * when the condition was evaluated.
 *
 * An unanswered question is not absent from the runner's evaluation context -
 * it is present as `null` - so conditions still return a boolean for questions
 * that were skipped or never reached. Negative operators ("is not", "is shorter
 * than") return `true` in that case. Without knowing which referenced questions
 * were answered, a consumer cannot tell a real match from a vacuous one.
 * @see {@link formSubmitConditionReferenceSchema}
 */
export interface SubmitConditionReference {
  /**
   * The id of the referenced component
   */
  componentId: string

  /**
   * The name of the referenced component, as used in the submitted records
   */
  componentName: string

  /**
   * Whether the referenced component held an answer at the point of evaluation
   */
  answered: boolean
}

/**
 * The recorded outcome of a single condition at the point of submission.
 * V2 forms only - V1 conditions are not captured.
 * @see {@link formSubmitConditionEvaluationSchema}
 */
export interface SubmitConditionEvaluation {
  /**
   * The id of the condition, as authored in the V2 form definition
   */
  conditionId: string

  /**
   * The result of evaluating the condition
   */
  outcome: ConditionEvaluationOutcome

  /**
   * Every component the condition depends on, including those reached through
   * nested condition references, and whether each was answered
   */
  references: SubmitConditionReference[]
}

/**
 * An email address the submission should be sent to, in a given format.
 *
 * The same address can appear more than once with a different `audience` or
 * `version` - a recipient may want both the human-readable email and the
 * machine-processable one.
 * @see {@link formSubmitNotificationTargetSchema}
 */
export interface SubmitNotificationTarget {
  /**
   * The address to send to
   */
  emailAddress: string

  /**
   * Whether the submission should be sent in its human-readable or
   * machine-processable form
   */
  audience: OutputAudience

  /**
   * The version of the output format to send
   */
  version: string
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
   * The reference number of the user session
   */
  referenceNumber?: string

  /**
   * The currently-selected language at the point of submission
   */
  language?: string

  /**
   * The main form anwsers
   */
  main: SubmitRecord[]

  /**
   * The repeaters form answers
   */
  repeaters: SubmitRecordset[]

  /**
   * The outcome of every condition in the form definition, evaluated against
   * the final answers at the point of submission. V2 forms only.
   */
  conditionEvaluations?: SubmitConditionEvaluation[]

  /**
   * Where this submission should be sent, resolved at the point of submission.
   *
   * Comprises the form's `notificationEmail` ("Submitted forms sent to")
   * followed by every output whose condition passed - an output with no
   * condition always qualifies. Deduplicated on all three properties together,
   * so one address can still appear twice in different output formats.
   */
  notificationTargets?: SubmitNotificationTarget[]
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
  magicLinkGroupId?: string
  form: {
    id: string
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

export interface SaveAndExitRecord {
  magicLinkId: string
  magicLinkGroupId: string
  form: {
    id: string
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
  invalidPasswordAttempts: number
  createdAt: Date
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
