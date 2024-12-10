import Joi from 'joi'

import { type SortingOptions } from '~/src/common/sorting/types.js'

/**
 * Field definitions for sorting options.
 * @type {Record<keyof SortingOptions, Joi.Schema>}
 */
export const sortingOptionFields = {
  sortBy: Joi.string().valid('updatedAt', 'title').optional(),
  order: Joi.string().valid('asc', 'desc').optional()
}

/**
 * Joi schema for `SortingOptions` interface
 * @see {@link SortingOptions}
 */
export const sortingOptionsSchema: Joi.ObjectSchema<SortingOptions> =
  Joi.object(sortingOptionFields)
