import Joi from 'joi'

import { type PaginationOptions } from '~/src/common/pagination/types.js'

/**
 * Joi schema for `PaginationOptions` interface
 * @see {@link PaginationOptions}
 */
export const paginationOptionsSchema = Joi.object<PaginationOptions>({
  page: Joi.number().positive().integer().min(1),
  perPage: Joi.number().positive().integer().min(1).max(200)
}).optional()
