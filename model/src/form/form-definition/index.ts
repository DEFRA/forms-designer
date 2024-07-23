import Joi from 'joi'

import { type ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  type ConditionData,
  type ConditionFieldData,
  type ConditionGroupData,
  type ConditionRefData,
  type ConditionsModelData,
  type ConditionValueData,
  type RelativeTimeValueData
} from '~/src/conditions/types.js'
import {
  type ConditionWrapper,
  type FormDefinition,
  type Item,
  type Link,
  type List,
  type Page,
  type PhaseBanner,
  type Section
} from '~/src/form/form-definition/types.js'

/**
 * If an optional key is added, CURRENT_VERSION does not need to be incremented.
 * Only breaking changes will require an increment, as well as a migration script.
 */
export const CURRENT_VERSION = 2

const sectionsSchema = Joi.object<Section>().keys({
  name: Joi.string().required(),
  title: Joi.string().required(),
  hideTitle: Joi.boolean().optional().default(false)
})

const conditionFieldSchema = Joi.object<ConditionFieldData>().keys({
  name: Joi.string().required(),
  type: Joi.string().required(),
  display: Joi.string().required()
})

const conditionValueSchema = Joi.object<ConditionValueData>().keys({
  type: Joi.string().required(),
  value: Joi.string().required(),
  display: Joi.string().required()
})

const relativeTimeValueSchema = Joi.object<RelativeTimeValueData>().keys({
  type: Joi.string().required(),
  timePeriod: Joi.string().required(),
  timeUnit: Joi.string().required(),
  direction: Joi.string().required(),
  timeOnly: Joi.boolean().required()
})

const conditionRefSchema = Joi.object<ConditionRefData>().keys({
  conditionName: Joi.string().required(),
  conditionDisplayName: Joi.string().required(),
  coordinator: Joi.string().optional()
})

const conditionSchema = Joi.object<ConditionData>().keys({
  field: conditionFieldSchema,
  operator: Joi.string().required(),
  value: Joi.alternatives().try(conditionValueSchema, relativeTimeValueSchema),
  coordinator: Joi.string().optional()
})

const conditionGroupSchema = Joi.object<ConditionGroupData>()
  .keys({
    conditions: Joi.array().items(
      Joi.alternatives().try(
        conditionSchema,
        conditionRefSchema,
        Joi.link('#conditionGroupSchema')
      )
    )
  })
  .id('conditionGroupSchema')

const conditionsModelSchema = Joi.object<ConditionsModelData>().keys({
  name: Joi.string().required(),
  conditions: Joi.array().items(
    Joi.alternatives().try(
      conditionSchema,
      conditionRefSchema,
      conditionGroupSchema
    )
  )
})

const conditionWrapperSchema = Joi.object<ConditionWrapper>().keys({
  name: Joi.string().required(),
  displayName: Joi.string(),
  value: conditionsModelSchema.required()
})

export const componentSchema = Joi.object<ComponentDef>()
  .keys({
    type: Joi.string<ComponentType>().required(),
    name: Joi.string(),
    title: Joi.string().allow(''),
    hint: Joi.string().allow('').optional(),
    options: Joi.object({
      rows: Joi.number().empty(''),
      maxWords: Joi.number().empty(''),
      customValidationMessage: Joi.string().allow('')
    })
      .default({})
      .unknown(true),
    schema: Joi.object({
      min: Joi.number().empty(''),
      max: Joi.number().empty(''),
      length: Joi.number().empty('')
    })
      .unknown(true)
      .default({}),
    list: Joi.string().optional()
  })
  .unknown(true)

const nextSchema = Joi.object<Link>().keys({
  path: Joi.string().required(),
  condition: Joi.string().allow('').optional(),
  redirect: Joi.string().optional()
})

/**
 * `/status` is a special route for providing a user's application status.
 *  It should not be configured via the designer.
 */
const pageSchema = Joi.object<Page>().keys({
  path: Joi.string().required().disallow('/status'),
  title: Joi.string().allow(''),
  section: Joi.string(),
  controller: Joi.string().optional(),
  components: Joi.array<ComponentDef>().items(componentSchema),
  next: Joi.array<Link>().items(nextSchema)
})

const baseListItemSchema = Joi.object<Item>().keys({
  text: Joi.string().allow(''),
  description: Joi.string().allow('').optional(),
  conditional: Joi.object<Item['conditional']>()
    .keys({
      components: Joi.array<ComponentDef>()
        .required()
        .items(componentSchema.unknown(true))
        .unique('name')
    })
    .optional(),
  condition: Joi.string().allow('').optional()
})

const stringListItemSchema = baseListItemSchema.append({
  value: Joi.string().required()
})

const numberListItemSchema = baseListItemSchema.append({
  value: Joi.number().required()
})

const listSchema = Joi.object<List>().keys({
  name: Joi.string().required(),
  title: Joi.string().allow(''),
  type: Joi.string().required().valid('string', 'number'),
  items: Joi.when('type', {
    is: 'string',
    then: Joi.array()
      .items(stringListItemSchema)
      .unique('text')
      .unique('value'),
    otherwise: Joi.array()
      .items(numberListItemSchema)
      .unique('text')
      .unique('value')
  })
})

const feedbackSchema = Joi.object<FormDefinition['feedback']>().keys({
  feedbackForm: Joi.boolean().default(false),
  url: Joi.when('feedbackForm', {
    is: Joi.boolean().valid(false),
    then: Joi.string().optional().allow('')
  }),
  emailAddress: Joi.string()
    .email({
      tlds: {
        allow: false
      }
    })
    .optional()
})

const phaseBannerSchema = Joi.object<PhaseBanner>().keys({
  phase: Joi.string().valid('alpha', 'beta')
})

/**
 * Joi schema for `FormDefinition` interface
 * @see {@link FormDefinition}
 */
export const formDefinitionSchema = Joi.object<FormDefinition>()
  .required()
  .keys({
    name: Joi.string().allow('').optional(),
    feedback: feedbackSchema.optional(),
    startPage: Joi.string().optional(),
    pages: Joi.array<Page>().required().items(pageSchema).unique('path'),
    sections: Joi.array<Section>()
      .items(sectionsSchema)
      .unique('name')
      .required(),
    conditions: Joi.array<ConditionWrapper>()
      .items(conditionWrapperSchema)
      .unique('name'),
    lists: Joi.array<List>().items(listSchema).unique('name'),
    metadata: Joi.object({ a: Joi.any() }).unknown().optional(),
    declaration: Joi.string().allow('').optional(),
    skipSummary: Joi.boolean().optional().default(false),
    phaseBanner: phaseBannerSchema.optional(),
    outputEmail: Joi.string()
      .email({ tlds: { allow: ['uk'] } })
      .trim()
      .optional()
  })

// Maintain compatibility with legacy named export
// E.g. `import { Schema } from '@defra/forms-model'`
export const Schema = formDefinitionSchema
