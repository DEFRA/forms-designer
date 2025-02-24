import Joi from 'joi'

import { type PatchPageFields } from '~/src/form/form-manager/types.js'
import { pageSchema } from '~/src/index.js'

export const patchPageSchema = Joi.object<PatchPageFields>()
  .keys({
    title: pageSchema.extract('title').optional(),
    path: pageSchema.extract('path').optional()
  })
  .required()
  .min(1)
