import Joi from 'joi'

import { type SearchOptions } from '~/src/common/search/types.js'
import { organisations } from '~/src/form/form-metadata/index.js'

/**
 * Field definitions for search options.
 */
export const searchOptionFields = {
  title: Joi.string().trim().allow('').max(255).optional().default(''),
  userId: Joi.string().guid().allow('').optional().default(''),
  organisations: Joi.array()
    .items(Joi.string().valid(...organisations))
    .single()
    .optional()
    .default([]),
  status: Joi.array()
    .items(Joi.string().valid('draft', 'live'))
    .single()
    .optional()
    .default([])
}

/**
 * Joi schema for {@link SearchOptions} interface
 */
export const searchOptionsSchema: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFields)
