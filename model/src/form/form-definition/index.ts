import Joi from 'joi'

import { type ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  type ConditionRawData,
  type ConditionWrapperValue,
  type ConfirmationPage,
  type FormDefinition,
  type Item,
  type List,
  type Next,
  type Page,
  type PhaseBanner,
  type RepeatingFieldPage,
  type Section,
  type SpecialPages
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

const conditionFieldSchema = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().required(),
  display: Joi.string().required()
})

const conditionValueSchema = Joi.object().keys({
  type: Joi.string().required(),
  value: Joi.string().required(),
  display: Joi.string().required()
})

const relativeTimeValueSchema = Joi.object().keys({
  type: Joi.string().required(),
  timePeriod: Joi.string().required(),
  timeUnit: Joi.string().required(),
  direction: Joi.string().required(),
  timeOnly: Joi.boolean().required()
})

const conditionRefSchema = Joi.object().keys({
  conditionName: Joi.string().required(),
  conditionDisplayName: Joi.string().required(),
  coordinator: Joi.string().optional()
})

const conditionSchema = Joi.object().keys({
  field: conditionFieldSchema,
  operator: Joi.string().required(),
  value: Joi.alternatives().try(conditionValueSchema, relativeTimeValueSchema),
  coordinator: Joi.string().optional()
})

const conditionGroupSchema = Joi.object().keys({
  conditions: Joi.array().items(
    Joi.alternatives().try(
      conditionSchema,
      conditionRefSchema,
      Joi.any() /** Should be a joi.link('#conditionGroupSchema') */
    )
  )
})

const conditionsModelSchema = Joi.alternatives<ConditionWrapperValue>().try(
  Joi.string(),
  Joi.object().keys({
    name: Joi.string().required(),
    conditions: Joi.array().items(
      Joi.alternatives().try(
        conditionSchema,
        conditionRefSchema,
        conditionGroupSchema
      )
    )
  })
)

const conditionsSchema = Joi.object<ConditionRawData>().keys({
  name: Joi.string().required(),
  displayName: Joi.string(),
  value: conditionsModelSchema.required()
})

const localisedString = Joi.alternatives().try(
  Joi.object({ a: Joi.any() }).unknown(),
  Joi.string().allow('')
)

export const componentSchema = Joi.object<ComponentDef>()
  .keys({
    type: Joi.string<ComponentType>().required(),
    name: Joi.string(),
    title: localisedString,
    hint: localisedString.optional(),
    options: Joi.object().default({}),
    schema: Joi.object({ min: Joi.number(), max: Joi.number() })
      .unknown(true)
      .default({}),
    list: Joi.string().optional()
  })
  .unknown(true)

const nextSchema = Joi.object<Next>().keys({
  path: Joi.string().required(),
  condition: Joi.string().allow('').optional(),
  redirect: Joi.string().optional()
})

/**
 * `/status` is a special route for providing a user's application status.
 *  It should not be configured via the designer.
 */
const pageSchema = Joi.object<Page | RepeatingFieldPage>().keys({
  path: Joi.string().required().disallow('/status'),
  title: localisedString,
  section: Joi.string(),
  controller: Joi.string().optional(),
  components: Joi.array<ComponentDef>().items(componentSchema),
  next: Joi.array<Next>().items(nextSchema),
  repeatField: Joi.string().optional(),
  options: Joi.object().optional(),
  backLinkFallback: Joi.string().optional()
})

const toggleableString = Joi.alternatives().try(Joi.boolean(), Joi.string())

const confirmationPageSchema = Joi.object<ConfirmationPage>({
  customText: Joi.object<ConfirmationPage['customText']>({
    title: Joi.string().default('Application complete'),
    nextSteps: toggleableString.default(
      'You will receive an email with details with the next steps.'
    )
  }).default(),
  components: Joi.array<ComponentDef>().items(componentSchema)
})

const specialPagesSchema = Joi.object<SpecialPages>().keys({
  confirmationPage: confirmationPageSchema.optional()
})

const baseListItemSchema = Joi.object<Item>().keys({
  text: localisedString,
  description: localisedString.optional(),
  conditional: Joi.object<Item['conditional']>()
    .keys({
      components: Joi.array<ComponentDef>()
        .required()
        .items(componentSchema.unknown(true))
        .unique('name')
    })
    .allow(null)
    .optional(),
  condition: Joi.string().allow(null, '').optional()
})

const stringListItemSchema = baseListItemSchema.append({
  value: Joi.string().required()
})

const numberListItemSchema = baseListItemSchema.append({
  value: Joi.number().required()
})

const listSchema = Joi.object<List>().keys({
  name: Joi.string().required(),
  title: localisedString,
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
    name: localisedString.optional(),
    feedback: feedbackSchema.optional(),
    startPage: Joi.string().optional(),
    pages: Joi.array<Page | RepeatingFieldPage>()
      .required()
      .items(pageSchema)
      .unique('path'),
    sections: Joi.array<Section>()
      .items(sectionsSchema)
      .unique('name')
      .required(),
    conditions: Joi.array<ConditionRawData>()
      .items(conditionsSchema)
      .unique('name'),
    lists: Joi.array<List>().items(listSchema).unique('name'),
    metadata: Joi.object({ a: Joi.any() }).unknown().optional(),
    declaration: Joi.string().allow('').optional(),
    skipSummary: Joi.boolean().optional().default(false),
    phaseBanner: phaseBannerSchema.optional(),
    specialPages: specialPagesSchema.optional(),
    outputEmail: Joi.string()
      .email({ tlds: { allow: ['uk'] } })
      .trim()
      .optional()
  })

// Maintain compatibility with legacy named export
// E.g. `import { Schema } from '@defra/forms-model'`
export const Schema = formDefinitionSchema
