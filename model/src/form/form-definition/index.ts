import Joi, { type LanguageMessages } from 'joi'
import { v4 as uuidV4 } from 'uuid'

import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  type ConditionData,
  type ConditionFieldData,
  type ConditionGroupData,
  type ConditionRefData,
  type ConditionValueData,
  type ConditionsModelData,
  type RelativeDateValueData
} from '~/src/conditions/types.js'
import {
  type ConditionWrapper,
  type Event,
  type EventOptions,
  type Events,
  type FormDefinition,
  type Item,
  type Link,
  type List,
  type Page,
  type PhaseBanner,
  type Repeat,
  type RepeatOptions,
  type RepeatSchema,
  type Section
} from '~/src/form/form-definition/types.js'

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

const relativeDateValueSchema = Joi.object<RelativeDateValueData>().keys({
  type: Joi.string().required(),
  period: Joi.string().required(),
  unit: Joi.string().required(),
  direction: Joi.string().required()
})

const conditionRefSchema = Joi.object<ConditionRefData>().keys({
  conditionName: Joi.string().required(),
  conditionDisplayName: Joi.string().required(),
  coordinator: Joi.string().optional()
})

const conditionSchema = Joi.object<ConditionData>().keys({
  field: conditionFieldSchema,
  operator: Joi.string().required(),
  value: Joi.alternatives().try(conditionValueSchema, relativeDateValueSchema),
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
    id: Joi.string().uuid().optional(),
    type: Joi.string<ComponentType>().required(),
    shortDescription: Joi.string().optional(),
    name: Joi.when('type', {
      is: Joi.string().valid(
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.Markdown
      ),
      then: Joi.string()
        .pattern(/^[a-zA-Z]+$/)
        .optional(),
      otherwise: Joi.string().pattern(/^[a-zA-Z]+$/)
    }),
    title: Joi.when('type', {
      is: Joi.string().valid(
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.Markdown
      ),
      then: Joi.string().optional(),
      otherwise: Joi.string().allow('')
    }),
    hint: Joi.string().allow('').optional(),
    options: Joi.object({
      rows: Joi.number().empty(''),
      maxWords: Joi.number().empty(''),
      maxDaysInPast: Joi.number().empty(''),
      maxDaysInFuture: Joi.number().empty(''),
      customValidationMessage: Joi.string().allow(''),
      customValidationMessages: Joi.object<LanguageMessages>()
        .unknown(true)
        .optional()
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

export const componentSchemaV2 = componentSchema.keys({
  id: Joi.string()
    .uuid()
    .default(() => uuidV4())
})

const nextSchema = Joi.object<Link>().keys({
  path: Joi.string().required(),
  condition: Joi.string().allow('').optional(),
  redirect: Joi.string().optional()
})

const repeatOptions = Joi.object<RepeatOptions>().keys({
  name: Joi.string().required(),
  title: Joi.string().required()
})

const repeatSchema = Joi.object<RepeatSchema>().keys({
  min: Joi.number().empty('').required(),
  max: Joi.number().empty('').required()
})

const pageRepeatSchema = Joi.object<Repeat>().keys({
  options: repeatOptions.required(),
  schema: repeatSchema.required()
})

const eventSchema = Joi.object<Event>().keys({
  type: Joi.string().allow('http').required(),
  options: Joi.object<EventOptions>().keys({
    method: Joi.string().allow('POST').required(),
    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required()
  })
})

const eventsSchema = Joi.object<Events>().keys({
  onLoad: eventSchema.optional(),
  onSave: eventSchema.optional()
})

/**
 * `/status` is a special route for providing a user's application status.
 *  It should not be configured via the designer.
 */
export const pageSchema = Joi.object<Page>().keys({
  id: Joi.string().uuid().optional(),
  path: Joi.string().required().disallow('/status'),
  title: Joi.string().required(),
  section: Joi.string(),
  controller: Joi.string().optional(),
  components: Joi.array<ComponentDef>().items(componentSchema).unique('name'),
  repeat: Joi.when('controller', {
    is: Joi.string().valid('RepeatPageController').required(),
    then: pageRepeatSchema.required(),
    otherwise: Joi.any().strip()
  }),
  condition: Joi.string().allow('').optional(),
  next: Joi.array<Link>().items(nextSchema).default([]),
  events: eventsSchema.optional(),
  view: Joi.string().optional()
})

/**
 * V2 engine schema - used with new editor
 */
export const pageSchemaV2 = pageSchema.append({
  title: Joi.string().allow('').required()
})

export const pageSchemaPayloadV2 = pageSchemaV2.keys({
  id: Joi.string()
    .uuid()
    .default(() => uuidV4()),
  components: Joi.array<ComponentDef>()
    .items(componentSchemaV2)
    .unique('name')
    .unique('id', { ignoreUndefined: true })
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
  condition: Joi.string().allow('').optional(),
  hint: Joi.string().allow('').optional()
})

const stringListItemSchema = baseListItemSchema.append({
  value: Joi.string().required()
})

const numberListItemSchema = baseListItemSchema.append({
  value: Joi.number().required()
})

export const listSchema = Joi.object<List>().keys({
  id: Joi.string().uuid().optional(),
  name: Joi.string().required(),
  title: Joi.string().required(),
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

/**
 * v2 Joi schema for Lists
 */
export const listSchemaV2 = listSchema.keys({
  id: Joi.string()
    .uuid()
    .default(() => uuidV4())
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

const outputSchema = Joi.object<FormDefinition['output']>().keys({
  audience: Joi.string().valid('human', 'machine').required(),
  version: Joi.string().required()
})

/**
 * Joi schema for `FormDefinition` interface
 * @see {@link FormDefinition}
 */
export const formDefinitionSchema = Joi.object<FormDefinition>()
  .required()
  .keys({
    engine: Joi.string().allow('V1', 'V2').default('V1'),
    name: Joi.string().allow('').optional(),
    feedback: feedbackSchema.optional(),
    startPage: Joi.string().optional(),
    pages: Joi.array<Page>()
      .required()
      .when('engine', {
        is: 'V2',
        then: Joi.array<Page>().items(pageSchemaV2),
        otherwise: Joi.array<Page>().items(pageSchema)
      })
      .unique('path')
      .unique('id', { ignoreUndefined: true }),
    sections: Joi.array<Section>()
      .items(sectionsSchema)
      .unique('name')
      .unique('title')
      .required(),
    conditions: Joi.array<ConditionWrapper>()
      .items(conditionWrapperSchema)
      .unique('name')
      .unique('displayName'),
    lists: Joi.array<List>().items(listSchema).unique('name').unique('title'),
    metadata: Joi.object({ a: Joi.any() }).unknown().optional(),
    declaration: Joi.string().allow('').optional(),
    skipSummary: Joi.any().strip(),
    phaseBanner: phaseBannerSchema.optional(),
    outputEmail: Joi.string()
      .email({ tlds: { allow: ['uk'] } })
      .trim()
      .optional(),
    output: outputSchema.optional()
  })

export const formDefinitionV2PayloadSchema = formDefinitionSchema.keys({
  pages: Joi.array<Page>()
    .items(pageSchemaPayloadV2)
    .required()
    .unique('path')
    .unique('id', { ignoreUndefined: true }),
  lists: Joi.array<List>()
    .items(listSchemaV2)
    .unique('name')
    .unique('title')
    .unique('id', { ignoreUndefined: true })
})

// Maintain compatibility with legacy named export
// E.g. `import { Schema } from '@defra/forms-model'`
export const Schema = formDefinitionSchema
