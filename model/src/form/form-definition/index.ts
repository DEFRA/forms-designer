import Joi, { type LanguageMessages } from 'joi'

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
  type FormDefinition,
  type Item,
  type List,
  type Page,
  type PageBase,
  type PageCondition,
  type PageGroup,
  type Section
} from '~/src/form/form-definition/types.js'
import { hasComponents } from '~/src/pages/helpers.js'

const idSchema = Joi.string()
  .pattern(/^[A-Za-z]{6}$/)
  .length(6)
  .required()

const sectionSchema = Joi.object<Section>().keys({
  id: idSchema,
  title: Joi.string().required()
})

const pageGroupSchema = Joi.object<PageGroup>().keys({
  id: idSchema,
  title: Joi.string().required(),
  condition: Joi.string().optional()
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
    type: Joi.string<ComponentType>().required(),
    id: idSchema,
    title: Joi.when('type', {
      is: Joi.string().valid(
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText
      ),
      then: Joi.any().strip(),
      otherwise: Joi.string().required()
    }),
    hint: Joi.string().allow('').optional(),
    options: Joi.object({
      rows: Joi.number(),
      maxWords: Joi.number(),
      maxDaysInPast: Joi.number(),
      maxDaysInFuture: Joi.number(),
      customValidationMessage: Joi.string().allow(''),
      customValidationMessages: Joi.object<LanguageMessages>()
        .unknown(true)
        .optional()
    })
      .default({})
      .unknown(true),
    schema: Joi.object({
      min: Joi.number(),
      max: Joi.number(),
      length: Joi.number()
    })
      .unknown(true)
      .default({}),
    list: Joi.string()
      .valid(
        Joi.ref('/lists', {
          in: true,
          adjust: (lists: List[]) => lists.map((list) => list.id)
        })
      )
      .optional()
  })
  .unknown(true)

const pageConditionSchema = Joi.object<PageCondition>().keys({
  pageId: idSchema.valid(
    Joi.ref('/pages', {
      in: true,
      adjust: (pages: Page[]) => pages.map((page) => page.id)
    })
  ),
  componentId: idSchema.valid(
    Joi.ref('/pages', {
      in: true,
      adjust: (pages: Page[]) =>
        pages.flatMap((page) =>
          hasComponents(page)
            ? page.components.map((component) => component.id)
            : []
        )
    })
  ),
  operator: Joi.string().valid('==').required(),
  valueId: idSchema.valid(
    Joi.ref('/lists', {
      in: true,
      adjust: (lists: List[]) =>
        lists.flatMap((list) => list.items.map((item) => item.id))
    })
  )
})

const pageSchema = Joi.object<Page>().keys({
  id: idSchema,
  path: Joi.string().required(),
  title: Joi.string().required(),
  section: Joi.string()
    .valid(
      Joi.ref('/sections', {
        in: true,
        adjust: (sections: Section[]) => sections.map((section) => section.id)
      })
    )
    .optional(),
  controller: Joi.string().optional(),
  components: Joi.array<ComponentDef>().items(componentSchema).unique('id'),
  group: Joi.string()
    .valid(
      Joi.ref('/pageGroups', {
        in: true,
        adjust: (groups: PageGroup[]) => groups.map((group) => group.id)
      })
    )
    .optional(),
  condition: Joi.array<PageBase['condition'][]>().items(
    Joi.array<PageBase['condition']>().items(pageConditionSchema)
  )
  // condition: Joi.string()
  //   .valid(
  //     Joi.in('/conditions', {
  //       adjust: (conditions: ConditionWrapper[]) =>
  //         conditions.map((condition) => condition.id)
  //     })
  //   )
  //   .optional()
  // condition: Joi.alternatives().try(
  //   Joi.array<PageBase['condition']>().items(pageConditionSchema).single(),
  //   Joi.array<PageBase['condition'][]>().items(
  //     Joi.array<PageBase['condition']>().items(pageConditionSchema)
  //   )
  // )
})

const baseListItemSchema = Joi.object<Item>().keys({
  id: idSchema,
  text: Joi.string().allow('')
})

const stringListItemSchema = baseListItemSchema.append({
  value: Joi.string().required()
})

const numberListItemSchema = baseListItemSchema.append({
  value: Joi.number().required()
})

const booleanListItemSchema = baseListItemSchema.append({
  value: Joi.boolean().required()
})

const listSchema = Joi.object<List>().keys({
  id: idSchema,
  title: Joi.string().required(),
  type: Joi.string().required().valid('string', 'number', 'boolean'),
  items: Joi.array()
    .unique('id')
    .unique('text')
    .unique('value')
    .items(
      Joi.when('type', {
        switch: [
          { is: 'string', then: stringListItemSchema },
          { is: 'number', then: numberListItemSchema },
          { is: 'boolean', then: booleanListItemSchema }
        ]
      })
    )
})

/**
 * Joi schema for `FormDefinition` interface
 * @see {@link FormDefinition}
 */
export const formDefinitionSchema = Joi.object<FormDefinition>()
  .required()
  .keys({
    id: idSchema,
    name: Joi.string().required(),
    pages: Joi.array<Page>()
      .required()
      .items(pageSchema)
      .unique('id')
      .unique('path'),
    pageGroups: Joi.array<PageGroup>()
      .items(pageGroupSchema)
      .unique('id')
      .unique('title')
      .default([]),
    sections: Joi.array<Section>()
      .items(sectionSchema)
      .unique('id')
      .unique('title')
      .default([]),
    conditions: Joi.array(),
    // conditions: Joi.array<ConditionWrapper>()
    //   .items(conditionWrapperSchema)
    //   .unique('name')
    //   .unique('displayName'),
    lists: Joi.array<List>()
      .items(listSchema)
      .unique('id')
      .unique('title')
      .default([])
  })
