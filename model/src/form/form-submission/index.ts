import Joi from 'joi'

import {
  SubmissionEventMessageCategory,
  SubmissionEventMessageSchemaVersion,
  SubmissionEventMessageSource,
  SubmissionEventMessageType
} from '~/src/form/form-submission/enums.js'
import {
  type SaveAndExitMessageData,
  type SubmissionMessage,
  type SubmitPayload,
  type SubmitRecord,
  type SubmitRecordset
} from '~/src/form/form-submission/types.js'

/**
 * Joi schema for `SubmitRecord` interface
 * @see {@link SubmitRecord}
 */
export const formSubmitRecordSchema = Joi.object<SubmitRecord>({
  name: Joi.string()
    .required()
    .description('Field identifier matching the component name'),
  title: Joi.string()
    .required()
    .description('Human-readable label for the field'),
  value: Joi.string()
    .required()
    .allow('')
    .description('User-submitted value for the field, may be empty')
}).description('Individual field value in a form submission')

/**
 * Joi schema for `SubmitRecordset` interface
 * @see {@link SubmitRecordset}
 */
export const formSubmitRecordsetSchema = Joi.object<SubmitRecordset>({
  name: Joi.string()
    .required()
    .description('Identifier for the repeatable section'),
  title: Joi.string()
    .required()
    .description('Human-readable title for the repeatable section'),
  value: Joi.array<SubmitRecord[]>()
    .items(Joi.array<SubmitRecord>().items(formSubmitRecordSchema).required())
    .required()
    .description(
      'Array of record arrays, each representing a repeated instance'
    )
}).description('Collection of repeated field values from a repeatable section')

/**
 * Joi schema for `SubmitPayload` interface
 * @see {@link SubmitPayload}
 */
export const formSubmitPayloadSchema = Joi.object<SubmitPayload>()
  .keys({
    retrievalKey: Joi.string()
      .required()
      .description('Unique key to retrieve this submission later'),
    sessionId: Joi.string()
      .required()
      .description('User session identifier for tracking and security'),
    main: Joi.array<SubmitRecord>()
      .items(formSubmitRecordSchema)
      .required()
      .description('Main (non-repeating) field values from the form'),
    repeaters: Joi.array<SubmitRecordset>()
      .items(formSubmitRecordsetSchema)
      .required()
      .description('Repeatable section values from the form')
  })
  .required()
  .description('Complete form submission payload structure with all form data')

export const saveAndExitMessageData = Joi.object<SaveAndExitMessageData>().keys(
  {
    formId: Joi.string().required(),
    email: Joi.string().required(),
    security: {
      question: Joi.string().required(),
      answer: Joi.string().required()
    },
    state: Joi.object().required()
  }
)

export const submissionMessageSchema = Joi.object<SubmissionMessage>().keys({
  schemaVersion: Joi.string()
    .valid(...Object.values(SubmissionEventMessageSchemaVersion))
    .required()
    .description(
      'The version of the SubmissionMessage - bumped with breaking changes'
    ),
  category: Joi.string()
    .valid(...Object.values(SubmissionEventMessageCategory))
    .required()
    .description('The message category - what does the entityId represent?'),
  source: Joi.string()
    .valid(...Object.values(SubmissionEventMessageSource))
    .required()
    .description('Source of the message - which service?'),
  type: Joi.string()
    .valid(...Object.values(SubmissionEventMessageType))
    .description('Event type'),
  entityId: Joi.string()
    .required()
    .description('The id of the entity the category relates to'),
  traceId: Joi.string()
    .optional()
    .description(
      'Trace id of the event - to link events across multiple services'
    ),
  createdAt: Joi.date()
    .required()
    .description(
      'The ISO timestamp where the action took place - should be the same as updated_at field in DB'
    ),
  messageCreatedAt: Joi.date()
    .required()
    .description('ISO timestamp when the message was published'),
  data: saveAndExitMessageData
})
