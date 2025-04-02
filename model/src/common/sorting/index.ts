import Joi from 'joi'

import { type SortingOptions } from '~/src/common/sorting/types.js'

/**
 * Field definitions for sorting options.
 */
export const sortingOptionFields = {
  sortBy: Joi.string()
    .valid('updatedAt', 'title')
    .optional()
    .description('Field to sort results by'),
  order: Joi.string()
    .valid('asc', 'desc')
    .optional()
    .description('Sort order (ascending or descending)')
}

/**
 * Joi schema for `SortingOptions` interface
 * @see {@link SortingOptions}
 */
export const sortingOptionsSchema: Joi.ObjectSchema<SortingOptions> =
  Joi.object(sortingOptionFields)
