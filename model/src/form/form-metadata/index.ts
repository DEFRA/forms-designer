import Joi from 'joi'

import {
  type FormMetadata,
  type FormMetadataInput,
  type FormMetadataState,
  type FormMetadataAuthor
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
export const slugSchema = Joi.string()
  .lowercase()
  .trim()
  .replace(/[\s–—]/g, '-') // replace spaces, en-dashes and em-dashes with hyphens
  .replace(/[^a-z0-9-]/g, '') // remove non-matching characters except spaces
  .replace(/-+/g, '-') // replace multiple hyphens with a single hyphen
  .required()

export const organisationSchema = Joi.string()
  .valid(...organisations)
  .required()

export const teamNameSchema = Joi.string().max(100).trim().required()
export const teamEmailSchema = Joi.string()
  .email({ tlds: { allow: ['uk'] } })
  .trim()
  .required()

export const authoredAtSchema = Joi.date().iso().required()
export const authorIdSchema = Joi.string().uuid().trim().required()
export const authorDisplayNameSchema = Joi.string().trim().required()

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
 * Joi schema for `FormMetadataAuthor` interface
 * @see {@link FormMetadataAuthor}
 */
export const formMetadataAuthorSchema = Joi.object<FormMetadataAuthor>()
  .keys({
    id: authorIdSchema,
    displayName: authorDisplayNameSchema
  })
  .required()

/**
 * Joi schema for `FormMetadataState` interface
 * @see {@link FormMetadataState}
 */
export const formMetadataStateSchema = Joi.object<FormMetadataState>().keys({
  createdAt: authoredAtSchema,
  createdBy: formMetadataAuthorSchema,
  updatedAt: authoredAtSchema,
  updatedBy: formMetadataAuthorSchema
})

/**
 * Joi schema for `FormMetadata` interface
 * @see {@link FormMetadata}
 */
export const formMetadataSchema = formMetadataInputSchema.append<FormMetadata>({
  id: idSchema,
  slug: slugSchema,
  draft: formMetadataStateSchema,
  live: formMetadataStateSchema
})
