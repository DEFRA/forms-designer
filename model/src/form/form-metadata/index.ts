import Joi from 'joi'

import {
  type FormMetadata,
  type FormMetadataAuthor,
  type FormMetadataContact,
  type FormMetadataContactEmail,
  type FormMetadataContactOnline,
  type FormMetadataInput,
  type FormMetadataState
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

export const idSchema = Joi.string()
  .hex()
  .length(24)
  .required()
  .description(
    'Unique identifier for the form, 24-character hexadecimal string'
  )

export const titleSchema = Joi.string()
  .max(250)
  .trim()
  .required()
  .description('Title of the form, displayed to users')

export const slugSchema = Joi.string()
  .pattern(/^[a-z0-9-]+$/, { name: 'letters, numbers and hyphens only' })
  .required()
  .description('URL-friendly identifier used in form paths')

export const organisationSchema = Joi.string()
  .valid(...organisations)
  .required()
  .description('Defra organisation responsible for the form')

export const teamNameSchema = Joi.string()
  .max(100)
  .trim()
  .required()
  .description('Name of the team responsible for the form')

export const teamEmailSchema = Joi.string()
  .email({ tlds: { allow: ['uk'] } })
  .trim()
  .required()
  .description('Contact email for the team responsible for the form')

export const phoneSchema = Joi.string()
  .trim()
  .description('Phone number for form-related inquiries')

export const emailAddressSchema = Joi.string()
  .email()
  .trim()
  .required()
  .description('Email address for form-related inquiries')

export const emailResponseTimeSchema = Joi.string()
  .trim()
  .required()
  .description('Expected response time for email inquiries')

export const emailSchema = Joi.object<FormMetadataContactEmail>()
  .keys({
    address: emailAddressSchema,
    responseTime: emailResponseTimeSchema
  })
  .description('Email contact details including response expectations')

export const onlineUrlSchema = Joi.string()
  .uri({
    scheme: ['http', 'https']
  })
  .trim()
  .required()
  .description('URL for online contact method')

export const onlineTextSchema = Joi.string()
  .trim()
  .required()
  .description('Descriptive text for the online contact link')

export const onlineSchema = Joi.object<FormMetadataContactOnline>()
  .keys({
    url: onlineUrlSchema,
    text: onlineTextSchema
  })
  .description('Online contact details with URL and descriptive text')

export const contactSchema = Joi.object<FormMetadataContact>()
  .keys({
    phone: phoneSchema,
    email: emailSchema,
    online: onlineSchema
  })
  .description('Complete contact information for form-related inquiries')

export const submissionGuidanceSchema = Joi.string()
  .trim()
  .description('Guidance text shown to users when submitting the form')

export const privacyNoticeUrlSchema = Joi.string()
  .uri({
    scheme: ['http', 'https']
  })
  .trim()
  .description('URL to the privacy notice for this form')

export const notificationEmailAddressSchema = Joi.string()
  .email()
  .trim()
  .description('Email address to receive form submission notifications')

export const authoredAtSchema = Joi.date()
  .iso()
  .required()
  .description('ISO format timestamp of when an action occurred')

export const authorIdSchema = Joi.string()
  .trim()
  .required()
  .description('Unique identifier for the author')

export const authorDisplayNameSchema = Joi.string()
  .trim()
  .required()
  .description('Human-readable name of the author')

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
  .description('Input data for creating or updating form metadata')

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
  .description('Information about the author of a form or form change')

/**
 * Joi schema for `FormMetadataState` interface
 * @see {@link FormMetadataState}
 */
export const formMetadataStateSchema = Joi.object<FormMetadataState>()
  .keys({
    createdAt: authoredAtSchema.description(
      'When this version was first created'
    ),
    createdBy: formMetadataAuthorSchema.description('Who created this version'),
    updatedAt: authoredAtSchema.description(
      'When this version was last updated'
    ),
    updatedBy: formMetadataAuthorSchema.description(
      'Who last updated this version'
    )
  })
  .description('Metadata about a specific version state (draft or live)')

/**
 * Joi schema for `FormMetadata` interface
 * @see {@link FormMetadata}
 */
export const formMetadataSchema = formMetadataInputSchema
  .append<FormMetadata>({
    id: idSchema,
    slug: slugSchema,
    draft: formMetadataStateSchema.description(
      'Metadata for the draft version'
    ),
    live: formMetadataStateSchema.description(
      'Metadata for the published version'
    ),
    createdAt: authoredAtSchema.description('When the form was first created'),
    createdBy: formMetadataAuthorSchema.description('Who created the form'),
    updatedAt: authoredAtSchema.description('When the form was last updated'),
    updatedBy: formMetadataAuthorSchema.description('Who last updated the form')
  })
  .description(
    'Complete metadata for a form, including version information and authoring details'
  )
