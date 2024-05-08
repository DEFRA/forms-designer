import Joi from 'joi'

import {
  type FormMetadataState,
  type FormMetadata,
  type FormMetadataInput
} from '~/src/form/form-metadata/types.js'

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

export const idSchema = Joi.string().hex().length(24).required()
export const titleSchema = Joi.string().max(250).trim().required()
export const slugSchema = Joi.string().required()
export const organisationSchema = Joi.string()
  .valid(...organisations)
  .required()
export const teamNameSchema = Joi.string().max(100).trim().required()
export const teamEmailSchema = Joi.string()
  .email({ tlds: { allow: ['uk'] } })
  .trim()
  .required()

/**
 * Joi schema for `FormMetadataInput` interface
 * @see {@link FormMetadataInput}
 */
export const formMetadataInputSchema = Joi.object<FormMetadataInput>()
  .keys({
    title: titleSchema,
    organisation: organisationSchema,
    teamName: teamNameSchema,
    teamEmail: teamEmailSchema
  })
  .required()

/**
 * Joi schema for `FormMetadataState` interface
 * @see {@link FormMetadataState}
 */
export const formMetadataStateSchema = Joi.object<FormMetadataState>().keys({
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().required()
})

/**
 * Joi schema for `FormMetadata` interface
 * @see {@link FormMetadata}
 */
export const formMetadataSchema = formMetadataInputSchema.append<FormMetadata>({
  id: idSchema,
  slug: slugSchema,
  draft: formMetadataStateSchema.required(),
  live: formMetadataStateSchema
})
