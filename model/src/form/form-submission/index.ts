import Joi from 'joi'

import { FormStatus } from '~/src/common/enums.js'
import {
  SecurityQuestionsEnum,
  SubmissionEventMessageCategory,
  SubmissionEventMessageSchemaVersion,
  SubmissionEventMessageSource,
  SubmissionEventMessageType
} from '~/src/form/form-submission/enums.js'
import {
  type SaveAndExitMessage,
  type SaveAndExitMessageData,
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
})
  .label('FormSubmitRecord')
  .description('Individual field value in a form submission')

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
    .items(
      Joi.array<SubmitRecord>()
        .items(formSubmitRecordSchema)
        .required()
        .label('FormSubmitRecordGroup')
    )
    .required()
    .description(
      'Array of record arrays, each representing a repeated instance'
    )
})
  .label('FormSubmitRecordset')
  .description('Collection of repeated field values from a repeatable section')

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
  .label('FormSubmitPayload')
  .description('Complete form submission payload structure with all form data')

export const saveAndExitMessageData = Joi.object<SaveAndExitMessageData>()
  .keys({
    form: Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      status: Joi.string().valid(FormStatus.Draft, FormStatus.Live).required(),
      isPreview: Joi.boolean().required(),
      baseUrl: Joi.string().required()
    }).label('SaveAndExitForm'),
    email: Joi.string().required(),
    security: Joi.object({
      question: Joi.string()
        .valid(...Object.values(SecurityQuestionsEnum))
        .required(),
      answer: Joi.string().required()
    }).label('SaveAndExitSecurity'),
    state: Joi.object().required()
  })
  .label('SaveAndExitMessageData')

export const submissionMessageSchema = Joi.object<SaveAndExitMessage>().keys({
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
