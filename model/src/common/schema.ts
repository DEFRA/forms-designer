import Joi from 'joi'

import { paginationOptionFields } from '~/src/common/pagination/index.js'
import {
  searchOptionFieldsManager,
  searchOptionFieldsUI
} from '~/src/common/search/index.js'
import { sortingOptionFields } from '~/src/common/sorting/index.js'
import { type QueryOptions } from '~/src/common/types.js'

/**
 * Joi schema for `QueryOptions` interface - for UI
 * @see {@link QueryOptions}
 */
export const queryOptionsSchemaUI: Joi.ObjectSchema<QueryOptions> = Joi.object({
  ...paginationOptionFields,
  ...sortingOptionFields,
  ...searchOptionFieldsUI
})

/**
 * Joi schema for `QueryOptions` interface - form forms-manager
 * @see {@link QueryOptions}
 */
export const queryOptionsSchemaManager: Joi.ObjectSchema<QueryOptions> =
  Joi.object({
    ...paginationOptionFields,
    ...sortingOptionFields,
    ...searchOptionFieldsManager
  })
