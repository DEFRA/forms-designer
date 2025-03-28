import Joi from 'joi'

import { type SearchOptions } from '~/src/common/search/types.js'
import { organisations } from '~/src/form/form-metadata/index.js'

/**
 * Field definitions for search options.
 */
export const searchOptionFields = {
  title: Joi.string()
    .trim()
    .allow('')
    .max(255)
    .optional()
    .default('')
    .description('Search by form title, empty string matches all'),
  author: Joi.string()
    .trim()
    .allow('')
    .max(100)
    .optional()
    .default('')
    .description('Search by form author, empty string matches all'),
  organisations: Joi.array()
    .items(Joi.string().valid(...organisations))
    .single()
    .optional()
    .default([])
    .description('Filter by organisation(s), empty array matches all'),
  status: Joi.array()
    .items(Joi.string().valid('draft', 'live'))
    .single()
    .optional()
    .default([])
    .description('Filter by form status(es), empty array matches all')
}

/**
 * Joi schema for {@link SearchOptions} interface
 */
export const searchOptionsSchema: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFields)
