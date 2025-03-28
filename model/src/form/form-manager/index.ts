import Joi from 'joi'

import { pageSchema } from '~/src/form/form-definition/index.js'
import { type PatchPageFields } from '~/src/form/form-manager/types.js'

export const patchPageSchema = Joi.object<PatchPageFields>()
  .keys({
    title: pageSchema.extract('title').optional(),
    path: pageSchema.extract('path').optional()
  })
  .required()
  .min(1)
