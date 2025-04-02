import Joi from 'joi'

import { pageSchema } from '~/src/form/form-definition/index.js'
import { type PatchPageFields } from '~/src/form/form-manager/types.js'

export const patchPageSchema = Joi.object<PatchPageFields>()
  .keys({
    title: pageSchema
      .extract('title')
      .optional()
      .description('New title to set for the page'),
    path: pageSchema
      .extract('path')
      .optional()
      .description('New URL path to set for the page')
  })
  .required()
  .min(1)
  .description(
    'Schema for partially updating a page, requiring at least one field to be provided'
  )
