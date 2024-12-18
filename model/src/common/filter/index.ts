import Joi from 'joi'

import { type FilterOptions } from '~/src/common/filter/types.js'

/**
 * Field definitions for filter options.
 */
export const filterOptionFields = {
  filter: Joi.object({
    title: Joi.string().trim().min(1).optional()
  }).optional()
}

/**
 * Joi schema for `FilterOptions` interface
 * @see {@link FilterOptions}
 */
export const filterOptionsSchema: Joi.ObjectSchema<FilterOptions> = Joi.object(
  filterOptionFields.filter
)
