import Joi from 'joi'

import { type FormMetadata } from '~/src/form/form-metadata/types.js'

export const titleSchema = Joi.string().max(250).trim().required()
export const organisationSchema = Joi.string().max(100).trim().required()
export const teamNameSchema = Joi.string().max(100).trim().required()
export const teamEmailSchema = Joi.string()
  .email({ tlds: { allow: ['uk'] } })
  .trim()
  .required()

/**
 * Joi schema for `FormMetadata` interface
 * @see {@link FormMetadata}
 */
export const formMetadataSchema = Joi.object<FormMetadata>()
  .keys({
    title: titleSchema,
    organisation: organisationSchema,
    teamName: teamNameSchema,
    teamEmail: teamEmailSchema
  })
  .required()
