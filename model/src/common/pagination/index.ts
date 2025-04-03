import Joi from 'joi'

import { type PaginationOptions } from '~/src/common/pagination/types.js'

/**
 * Field definitions for pagination options.
 */
export const paginationOptionFields = {
  page: Joi.number()
    .positive()
    .integer()
    .default(1)
    .min(1)
    .optional()
    .description('Current page number, starting from 1'),
  perPage: Joi.number()
    .positive()
    .integer()
    .default(24)
    .min(1)
    .max(200)
    .optional()
    .description('Number of items to display per page, between 1 and 200')
}

/**
 * Joi schema for `PaginationOptions` interface
 * @see {@link PaginationOptions}
 */
export const paginationOptionsSchema: Joi.ObjectSchema<PaginationOptions> =
  Joi.object(paginationOptionFields)
