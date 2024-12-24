import Joi from 'joi'

import { paginationOptionFields } from '~/src/common/pagination/index.js'
import { searchOptionFields } from '~/src/common/search/index.js'
import { sortingOptionFields } from '~/src/common/sorting/index.js'
import { type QueryOptions } from '~/src/common/types.js'

/**
 * Joi schema for `QueryOptions` interface
 * @see {@link QueryOptions}
 */
export const queryOptionsSchema: Joi.ObjectSchema<QueryOptions> = Joi.object({
  ...paginationOptionFields,
  ...sortingOptionFields,
  ...searchOptionFields
})
