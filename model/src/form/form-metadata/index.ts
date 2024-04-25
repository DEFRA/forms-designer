import Joi from 'joi'

import { type FormMetadata } from '~/src/form/form-metadata/types.js'

/**
 * Joi schema for `FormMetadata` interface
 * @see {@link FormMetadata}
 */
export const formMetadataSchema = Joi.object()
  .keys({
    title: Joi.string().max(250).trim().required(),
    organisation: Joi.string().max(100).trim().required(),
    teamName: Joi.string().max(100).trim().required(),
    teamEmail: Joi.string().email().trim().required()
  })
  .required()
