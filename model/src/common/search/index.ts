import Joi from 'joi'

import { FormFilterStatus, FormStatus } from '~/src/common/enums.js'
import { type SearchOptions } from '~/src/common/search/types.js'
import { organisations } from '~/src/form/form-metadata/index.js'

/**
 * Field definitions for search options.
 */
const searchOptionFieldsBase = {
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
  offline: Joi.boolean()
    .optional()
    .description('Filter by forms that are offline')
}

export const searchOptionFieldsUI = {
  ...searchOptionFieldsBase,
  status: Joi.array()
    .items(Joi.string().valid(...Object.values(FormFilterStatus)))
    .single()
    .optional()
    .default([])
    .description('Filter by form status(es), empty array matches all')
}

export const searchOptionFieldsManager = {
  ...searchOptionFieldsBase,
  status: Joi.array()
    .items(Joi.string().valid(...Object.values(FormStatus)))
    .single()
    .optional()
    .default([])
    .description('Filter by form status(es), empty array matches all')
}

/**
 * Joi schema for {@link SearchOptions} interface - for UI
 */
export const searchOptionsSchemaUI: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFieldsUI)

/**
 * Joi schema for {@link SearchOptions} interface - for forms-manager
 */
export const searchOptionsSchemaManager: Joi.ObjectSchema<SearchOptions> =
  Joi.object(searchOptionFieldsManager)
