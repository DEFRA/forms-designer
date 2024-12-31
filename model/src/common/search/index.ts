import Joi from 'joi'

import { type SearchOptions } from '~/src/common/search/types.js'

/**
 * Field definitions for search options.
 */
export const searchOptionFields = {
  title: Joi.string().trim().allow('').max(255).optional()
}

/**
 * Joi schema for {@link SearchOptions} interface
 */
export const searchOptionsSchema: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFields)
