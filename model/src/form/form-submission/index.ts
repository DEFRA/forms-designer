import Joi from 'joi'

import {
  type SubmitPayload,
  type SubmitRecord,
  type SubmitRecordset
} from '~/src/form/form-submission/types.js'

/**
 * Joi schema for `SubmitRecord` interface
 * @see {@link SubmitRecord}
 */
export const formSubmitRecordSchema = Joi.object<SubmitRecord>({
  name: Joi.string().required(),
  title: Joi.string().required(),
  value: Joi.string().required()
})

/**
 * Joi schema for `SubmitRecordset` interface
 * @see {@link SubmitRecordset}
 */
export const formSubmitRecordsetSchema = Joi.object<SubmitRecordset>({
  name: Joi.string().required(),
  title: Joi.string().required(),
  value: Joi.array<SubmitRecord[]>()
    .items(Joi.array<SubmitRecord>().items(formSubmitRecordSchema).required())
    .required()
})

/**
 * Joi schema for `SubmitPayload` interface
 * @see {@link SubmitPayload}
 */
export const formSubmitPayloadSchema = Joi.object<SubmitPayload>()
  .keys({
    retrievalKey: Joi.string().required(),
    sessionId: Joi.string().required(),
    main: Joi.array<SubmitRecord>().items(formSubmitRecordSchema).required(),
    repeaters: Joi.array<SubmitRecordset>()
      .items(formSubmitRecordsetSchema)
      .required()
  })
  .required()
