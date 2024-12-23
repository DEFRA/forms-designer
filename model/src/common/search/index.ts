import Joi from 'joi'

import { type SearchOptions } from '~/src/common/search/types.js'

/**
 * Field definitions for search options.
 */
export const searchOptionFields = {
  title: Joi.string().trim().min(1).optional()
}

/**
 * Joi schema for `SearchOptions` interface
 * @see {@link SearchOptions}
 */
export const searchOptionsSchema: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFields)
