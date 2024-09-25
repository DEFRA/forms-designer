import Joi from 'joi'

import {
  type FormMetadata,
  type FormMetadataInput,
  type FormMetadataState,
  type FormMetadataAuthor,
  type FormMetadataContact,
  type FormMetadataContactOnline,
  type FormMetadataContactEmail
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
  .pattern(/^[a-z0-9-]+$/, { name: 'letters, numbers and hyphens only' })
  .required()

export const organisationSchema = Joi.string()
  .valid(...organisations)
  .required()

export const teamNameSchema = Joi.string().max(100).trim().required()
export const teamEmailSchema = Joi.string()
  .email({ tlds: { allow: ['uk'] } })
  .trim()
  .required()

export const phoneSchema = Joi.string().trim()

export const emailAddressSchema = Joi.string().email().trim().required()
export const emailResponseTimeSchema = Joi.string().trim().required()
export const emailSchema = Joi.object<FormMetadataContactEmail>().keys({
  address: emailAddressSchema,
  responseTime: emailResponseTimeSchema
})

export const onlineUrlSchema = Joi.string()
  .uri({
    scheme: ['http', 'https']
  })
  .trim()
  .required()
export const onlineTextSchema = Joi.string().trim().required()
export const onlineSchema = Joi.object<FormMetadataContactOnline>().keys({
  url: onlineUrlSchema,
  text: onlineTextSchema
})

export const contactSchema = Joi.object<FormMetadataContact>().keys({
  phone: phoneSchema,
  email: emailSchema,
  online: onlineSchema
})

export const submissionGuidanceSchema = Joi.string().trim()

export const privacyNoticeUrlSchema = Joi.string()
  .uri({
    scheme: ['http', 'https']
  })
  .trim()

export const notificationEmailAddressSchema = Joi.string()
  .email({ tlds: { allow: ['uk'] } })
  .trim()
  .pattern(/\.gov\.uk$|\.org\.uk$/)

export const authoredAtSchema = Joi.date().iso().required()
export const authorIdSchema = Joi.string().trim().required()
export const authorDisplayNameSchema = Joi.string().trim().required()

export const formMetadataInputKeys = {
  title: titleSchema,
  organisation: organisationSchema,
  teamName: teamNameSchema,
  teamEmail: teamEmailSchema,
  contact: contactSchema,
  submissionGuidance: submissionGuidanceSchema,
  privacyNoticeUrl: privacyNoticeUrlSchema,
  notificationEmail: notificationEmailAddressSchema
}

/**
 * Joi schema for `FormMetadataInput` interface
 * @see {@link FormMetadataInput}
 */
export const formMetadataInputSchema = Joi.object<FormMetadataInput>()
  .keys(formMetadataInputKeys)
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
  live: formMetadataStateSchema,
  createdAt: authoredAtSchema,
  createdBy: formMetadataAuthorSchema,
  updatedAt: authoredAtSchema,
  updatedBy: formMetadataAuthorSchema
})
