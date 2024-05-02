import Joi from 'joi'

import { type FormMetadata } from '~/src/form/form-metadata/types.js'

export const organisations = [
  'Animal and Plant Health Agency – APHA',
  'Centre for Environment, Fisheries and Aquaculture Science – Cefas',
  'Defra',
  'Environment Agency',
  'Forestry Commission',
  'Marine Management Organisation – MMO',
  'Natural England',
  'Rural Payments Agency – RPA',
  'Veterinary Medicines Directorate – VMD'
]

export const titleSchema = Joi.string().max(250).trim().required()
export const organisationSchema = Joi.string()
  .valid(...organisations)
  .required()
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
