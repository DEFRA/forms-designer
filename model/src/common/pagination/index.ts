import Joi from 'joi'

import { type PaginationOptions } from '~/src/common/pagination/types.js'

/**
 * Field definitions for pagination options.
 */
export const paginationOptionFields = {
  page: Joi.number().positive().integer().default(1).min(1).optional(),
  perPage: Joi.number()
    .positive()
    .integer()
    .default(24)
    .min(1)
    .max(200)
    .optional()
}

/**
 * Joi schema for `PaginationOptions` interface
 * @see {@link PaginationOptions}
 */
export const paginationOptionsSchema: Joi.ObjectSchema<PaginationOptions> =
  Joi.object(paginationOptionFields)
