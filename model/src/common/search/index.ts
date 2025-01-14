import Joi from 'joi'

import { type SearchOptions } from '~/src/common/search/types.js'
import { organisations } from '~/src/form/form-metadata/index.js'

/**
 * Field definitions for search options.
 */
export const searchOptionFields = {
  title: Joi.string().trim().allow('').max(255).optional().default(''),
  author: Joi.string().trim().allow('').max(100).optional().default(''),
  organisations: Joi.alternatives()
    .try(
      Joi.string().valid(...organisations),
      Joi.array().items(Joi.string().valid(...organisations))
    )
    .optional()
    .default([])
    // We're converting single string values to array (e.g., ?organisations=Defra -> ['Defra']) as expected by the API
    .custom((value: string | string[]) =>
      Array.isArray(value) ? value : [value]
    ),
  status: Joi.alternatives()
    .try(
      Joi.string().valid('draft', 'live'),
      Joi.array().items(Joi.string().valid('draft', 'live'))
    )
    .optional()
    .default([])
    // We're converting single string values to array (e.g., ?status=draft -> ['draft']) as expected by the API
    .custom((value: string | string[]) =>
      Array.isArray(value) ? value : [value]
    )
}

/**
 * Joi schema for {@link SearchOptions} interface
 */
export const searchOptionsSchema: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFields)
