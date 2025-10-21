import JoiDate from '@joi/date'
import JoiBase, { type CustomHelpers, type LanguageMessages } from 'joi'
import { v4 as uuidV4 } from 'uuid'

import { ComponentType } from '~/src/components/enums.js'
import { isConditionalType } from '~/src/components/helpers.js'
import {
  type ComponentDef,
  type ContentComponentsDef,
  type FileUploadFieldComponent
} from '~/src/components/types.js'
import { ConditionType, OperatorName } from '~/src/conditions/enums.js'
import {
  type ConditionData,
  type ConditionDataV2,
  type ConditionFieldData,
  type ConditionGroupData,
  type ConditionGroupDataV2,
  type ConditionListItemRefValueDataV2,
  type ConditionRefData,
  type ConditionRefDataV2,
  type ConditionValueData,
  type ConditionsModelData,
  type RelativeDateValueData,
  type RelativeDateValueDataV2
} from '~/src/conditions/types.js'
import { isFormDefinition } from '~/src/form/form-definition/helpers.js'
import {
  SchemaVersion,
  type ConditionWrapper,
  type ConditionWrapperV2,
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
import { checkErrors } from '~/src/form/form-manager/errors.js'
import {
  FormDefinitionError,
  FormDefinitionErrorType
} from '~/src/form/form-manager/types.js'
import { ControllerType } from '~/src/pages/enums.js'
import {
  hasComponents,
  hasComponentsEvenIfNoNext
} from '~/src/pages/helpers.js'

const Joi = JoiBase.extend(JoiDate) as JoiBase.Root

const idSchemaOptional = Joi.string().uuid()

const idSchema = idSchemaOptional.default(() => uuidV4())

const conditionIdRef = Joi.ref('/conditions', {
  in: true,
  adjust: (conditions: ConditionWrapperV2[]) =>
    conditions.map((condition) => condition.id)
})

const componentIdRefSchema = Joi.ref('/pages', {
  in: true,
  adjust: (pages: Page[]) =>
    pages.flatMap((page) =>
      hasComponents(page)
        ? page.components
            .filter((component) => component.id)
            .map((component) => component.id)
        : []
    )
})

const listIdRef = Joi.ref('/lists', {
  in: true,
  adjust: (lists: List[]) =>
    lists.filter((list) => list.id).map((list) => list.id)
})

const listItemIdRef = Joi.ref('/lists', {
  in: true,
  adjust: (lists: List[]) =>
    lists.flatMap((list) =>
      list.items.filter((item) => item.id).map((item) => item.id)
    )
})

const sectionsSchema = Joi.object<Section>()
  .description('A form section grouping related pages together')
  .keys({
    name: Joi.string()
      .trim()
      .required()
      .description(
        'Unique identifier for the section, used in code and page references'
      ),
    title: Joi.string()
      .trim()
      .required()
      .description('Human-readable section title displayed to users'),
    hideTitle: Joi.boolean()
      .optional()
      .default(false)
      .description(
        'When true, the section title will not be displayed in the UI'
      )
  })

const conditionFieldSchema = Joi.object<ConditionFieldData>()
  .description('Field reference used in a condition')
  .keys({
    name: Joi.string()
      .trim()
      .required()
      .description('Component name referenced by this condition'),
    type: Joi.string()
      .trim()
      .required()
      .description('Data type of the field (e.g., string, number, date)'),
    display: Joi.string()
      .trim()
      .required()
      .description('Human-readable name of the field for display purposes')
  })

const conditionValueSchema = Joi.object<ConditionValueData>()
  .description('Value specification for a condition')
  .keys({
    type: Joi.string()
      .trim()
      .required()
      .description('Data type of the value (e.g., string, number, date)'),
    value: Joi.string()
      .trim()
      .required()
      .description('The actual value to compare against'),
    display: Joi.string()
      .trim()
      .required()
      .description('Human-readable version of the value for display purposes')
  })

const conditionListItemRefDataSchemaV2 =
  Joi.object<ConditionListItemRefValueDataV2>()
    .description('List item ref specification for a condition')
    .keys({
      listId: Joi.string()
        .trim()
        .required()
        .when('/lists', {
          is: Joi.exist(),
          then: Joi.valid(listIdRef)
        })
        .description('The id of the list')
        .error(checkErrors(FormDefinitionError.RefConditionListId)),
      itemId: Joi.string()
        .trim()
        .when('/lists', {
          is: Joi.exist(),
          then: Joi.valid(listItemIdRef)
        })
        .required()
        .description('The id of the list item')
        .error(checkErrors(FormDefinitionError.RefConditionItemId))
    })
    .custom(
      (
        value: ConditionListItemRefValueDataV2,
        helpers: CustomHelpers<ConditionListItemRefValueDataV2>
      ) => {
        const { listId, itemId } = value
        const [, , , , definition] = helpers.state.ancestors
        const list = (definition as FormDefinition).lists.find(
          (list) => list.id === listId
        )

        if (!list) {
          return helpers.error('any.ref', {
            arg: 'listId',
            ref: listId,
            reason: 'does not exist',
            errorType: FormDefinitionErrorType.Ref,
            errorCode: FormDefinitionError.RefConditionListId
          })
        }

        const itemIdExists = list.items.some((item) => item.id === itemId)
        return itemIdExists
          ? value
          : helpers.error('any.ref', {
              arg: 'itemId',
              ref: itemId,
              reason: `does not exist in list ${listId}`,
              errorType: FormDefinitionErrorType.Ref,
              errorCode: FormDefinitionError.RefConditionItemId
            })
      }
    )

const relativeDateValueDataSchemaV2 = Joi.object<RelativeDateValueDataV2>()
  .description('Relative date specification for date-based conditions')
  .keys({
    period: Joi.number()
      .integer()
      .positive()
      .required()
      .description('Numeric amount of the time period, as a string'),
    unit: Joi.string()
      .trim()
      .required()
      .description('Time unit (e.g. days, weeks, months, years)'),
    direction: Joi.string()
      .trim()
      .required()
      .description('Temporal direction, either "past" or "future"')
  })

const relativeDateValueDataSchema = Joi.object<RelativeDateValueData>()
  .description('Relative date specification for date-based conditions')
  .keys({
    type: Joi.string()
      .trim()
      .valid('RelativeDate')
      .required()
      .description('Type of the condition value, should be "RelativeDate"'),
    period: Joi.string()
      .trim()
      .required()
      .description('Numeric amount of the time period, as a string'),
    unit: Joi.string()
      .trim()
      .required()
      .description('Time unit (e.g. days, weeks, months, years)'),
    direction: Joi.string()
      .trim()
      .required()
      .description('Temporal direction, either "past" or "future"')
  })

const conditionRefSchema = Joi.object<ConditionRefData>()
  .description('Reference to a named condition defined elsewhere')
  .keys({
    conditionName: Joi.string()
      .trim()
      .required()
      .description('Name of the referenced condition'),
    conditionDisplayName: Joi.string()
      .trim()
      .required()
      .description('Human-readable name of the condition for display purposes'),
    coordinator: Joi.string()
      .trim()
      .optional()
      .description(
        'Logical operator connecting this condition with others (AND, OR)'
      )
  })

const conditionRefDataSchemaV2 = Joi.object<ConditionRefDataV2>()
  .description('Reference to a named condition defined elsewhere')
  .keys({
    id: idSchema.description('Unique identifier for the referenced condition'),
    conditionId: Joi.string()
      .trim()
      .required()
      .when('/conditions', {
        is: Joi.exist(),
        then: Joi.valid(conditionIdRef)
      })
      .description('Name of the referenced condition')
      .error(checkErrors(FormDefinitionError.RefConditionConditionId))
  })

const conditionSchema = Joi.object<ConditionData>()
  .description('Condition definition specifying a logical comparison')
  .keys({
    field: conditionFieldSchema.description(
      'The form field being evaluated in this condition'
    ),
    operator: Joi.string()
      .trim()
      .required()
      .description('Comparison operator (equals, greaterThan, contains, etc.)'),
    value: Joi.alternatives()
      .try(conditionValueSchema, relativeDateValueDataSchema)
      .description(
        'Value to compare the field against, either fixed or relative date'
      ),
    coordinator: Joi.string()
      .trim()
      .optional()
      .description(
        'Logical operator connecting this condition with others (AND, OR)'
      )
  })

export const MIN_NUMBER_OF_REPEAT_ITEMS = 1
export const MAX_NUMBER_OF_REPEAT_ITEMS = 200

export const conditionDataSchemaV2 = Joi.object<ConditionDataV2>()
  .description('Condition definition')
  .keys({
    id: idSchema.description(
      'Unique identifier used to reference this condition'
    ),
    componentId: Joi.string()
      .trim()
      .required()
      .when('/pages', {
        is: Joi.exist(),
        then: Joi.valid(componentIdRefSchema)
      })
      .description(
        'Reference to the component id being evaluated in this condition'
      )
      .error(checkErrors(FormDefinitionError.RefConditionComponentId)),
    operator: Joi.string()
      .trim()
      .valid(...Object.values(OperatorName))
      .required()
      .description('Comparison operator (equals, greaterThan, contains, etc.)'),
    type: Joi.string()
      .trim()
      .valid(...Object.values(ConditionType))
      .required()
      .description('Type of the condition value'),
    value: Joi.any()
      .required()
      .description('The actual value to compare against')
      .when('type', {
        switch: [
          { is: ConditionType.BooleanValue, then: Joi.boolean() },
          { is: ConditionType.StringValue, then: Joi.string() },
          { is: ConditionType.NumberValue, then: Joi.number() },
          {
            is: ConditionType.DateValue,
            then: Joi.date().format('YYYY-MM-DD').raw()
          },
          {
            is: ConditionType.ListItemRef,
            then: conditionListItemRefDataSchemaV2
          },
          {
            is: ConditionType.RelativeDate,
            then: relativeDateValueDataSchemaV2
          }
        ]
      })
      .description(
        'Value to compare the field against, either fixed or relative date'
      )
  })
  .custom((value: ConditionDataV2, helpers: CustomHelpers<ConditionDataV2>) => {
    const { componentId } = value
    const definition = helpers.state.ancestors.find(isFormDefinition) as
      | FormDefinition
      | undefined

    // Validation may not have been fired on the full FormDefinition
    // therefore we are unable to verify at this point, but the 'save'
    // will eventually validate the full FormDefinition
    if (!definition) {
      return value
    }

    const foundComponents = definition.pages
      .map((page) =>
        hasComponentsEvenIfNoNext(page)
          ? page.components.find((comp) => comp.id === componentId)
          : undefined
      )
      .filter(Boolean)

    const foundComponentHandlesConditions = foundComponents.length
      ? isConditionalType(foundComponents[0]?.type)
      : false

    return foundComponentHandlesConditions
      ? value
      : helpers.error('custom.incompatible', {
          incompatibleObject: {
            key: 'type',
            value: foundComponents[0]
          },
          valueKey: 'componentId',
          value: componentId,
          errorType: FormDefinitionErrorType.Incompatible,
          errorCode: FormDefinitionError.IncompatibleConditionComponentType,
          reason: 'does not support conditions'
        })
  })
  .custom((value, helpers) => {
    if (value.type === ConditionType.ListItemRef) {
      const { listId, itemId } = value.value
      const [, , , definition] = helpers.state.ancestors
      const list = definition.lists.find((list) => list.id === listId)

      if (!list) {
        return helpers.error('List not found')
      }

      const itemIdExists = list.items.some((item) => item.id === itemId)
      return itemIdExists ? value : helpers.error('oops')
    }
    return value
  })
  .messages({
    'custom.incompatible': 'Incompatible data value'
  })

const conditionGroupSchema = Joi.object<ConditionGroupData>()
  .description('Group of conditions combined with logical operators')
  .keys({
    conditions: Joi.array()
      .items(
        Joi.alternatives().try(
          conditionSchema,
          conditionRefSchema,
          Joi.link('#conditionGroupSchema')
        )
      )
      .description('Array of conditions or condition references in this group')
  })
  .id('conditionGroupSchema')

const conditionsModelSchema = Joi.object<ConditionsModelData>()
  .description('Complete condition model with name and condition set')
  .keys({
    name: Joi.string()
      .trim()
      .required()
      .description('Unique identifier for the condition set'),
    conditions: Joi.array()
      .items(
        Joi.alternatives().try(
          conditionSchema,
          conditionRefSchema,
          conditionGroupSchema
        )
      )
      .description(
        'Array of conditions, condition references, or condition groups'
      )
  })

const conditionWrapperSchema = Joi.object<ConditionWrapper>()
  .description('Container for a named condition with its definition')
  .keys({
    name: Joi.string()
      .trim()
      .required()
      .description('Unique identifier used to reference this condition'),
    displayName: Joi.string()
      .trim()
      .description('Human-readable name for display in the UI'),
    value: conditionsModelSchema
      .required()
      .description('The complete condition definition')
  })

export const conditionWrapperSchemaV2 = Joi.object<ConditionWrapperV2>()
  .description('Container for a named condition with its definition')
  .keys({
    id: idSchema.description('Unique identifier for the condition'),
    displayName: Joi.string()
      .trim()
      .description('Human-readable name for display in the UI'),
    coordinator: Joi.string()
      .optional()
      .when('items', { is: Joi.array().min(2), then: Joi.required() })
      .description(
        'Logical operator connecting this condition with others (AND, OR)'
      ),
    items: Joi.array<ConditionGroupDataV2>()
      .items(
        Joi.alternatives().conditional('.componentId', {
          is: Joi.exist(),
          then: conditionDataSchemaV2,
          otherwise: conditionRefDataSchemaV2
        })
      )
      .min(1)
      .max(15)
      .description('Array of conditions or condition references')
  })
  .description('Condition schema for V2 forms')

export const regexCustomValidator = (
  value: string,
  helpers: CustomHelpers<string>
) => {
  try {
    const _regex = new RegExp(value)
  } catch {
    return helpers.error('custom.incompatible', {
      errorType: FormDefinitionErrorType.Incompatible,
      errorCode: FormDefinitionError.IncompatibleQuestionRegex
    })
  }
  return value
}

export const componentSchema = Joi.object<ComponentDef>()
  .description('Form component definition specifying UI element behavior')
  .keys({
    id: idSchemaOptional.description('Unique identifier for the component'),
    type: Joi.string<ComponentType>()
      .trim()
      .required()
      .description('Component type (TextField, RadioButtons, DateField, etc.)'),
    shortDescription: Joi.string()
      .trim()
      .optional()
      .description('Brief description of the component purpose'),
    name: Joi.when('type', {
      is: Joi.string().valid(
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.Markdown
      ),
      then: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z]+$/)
        .optional()
        .description('Optional identifier for display-only components'),
      otherwise: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z]+$/)
        .required()
        .description('Unique identifier for the component, used in form data')
    }),
    title: Joi.when('type', {
      is: Joi.string().valid(
        ComponentType.Details,
        ComponentType.Html,
        ComponentType.InsetText,
        ComponentType.Markdown
      ),
      then: Joi.string()
        .trim()
        .optional()
        .description('Optional title for display-only components'),
      otherwise: Joi.string()
        .trim()
        .allow('')
        .description('Label displayed above the component')
    }),
    hint: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description(
        'Additional guidance text displayed below the component title'
      ),
    options: Joi.object({
      rows: Joi.number()
        .empty('')
        .description('Number of rows for textarea components'),
      maxWords: Joi.number()
        .empty('')
        .description('Maximum number of words allowed in text inputs'),
      maxDaysInPast: Joi.number()
        .empty('')
        .description('Maximum days in the past allowed for date inputs'),
      maxDaysInFuture: Joi.number()
        .empty('')
        .description('Maximum days in the future allowed for date inputs'),
      customValidationMessage: Joi.string()
        .trim()
        .allow('')
        .description('Custom error message for validation failures'),
      customValidationMessages: Joi.object<LanguageMessages>()
        .unknown(true)
        .optional()
        .description('Custom error messages keyed by validation rule name')
    })
      .default({})
      .unknown(true)
      .description('Component-specific configuration options'),
    schema: Joi.object({
      min: Joi.number()
        .empty('')
        .description('Minimum value or length for validation'),
      max: Joi.number()
        .empty('')
        .description('Maximum value or length for validation'),
      length: Joi.number()
        .empty('')
        .description('Exact length required for validation'),
      regex: Joi.when('type', {
        is: Joi.string().valid(
          ComponentType.TextField,
          ComponentType.MultilineTextField
        ),
        then: Joi.string() // NOSONAR
          .trim()
          .optional()
          .description('Regex expression for validation of user field content')
          .custom(regexCustomValidator),
        otherwise: Joi.string().allow('')
      }).messages({ 'custom.incompatible': 'The regex expression is invalid' })
    })
      .unknown(true)
      .default({})
      .description('Validation rules for the component'),
    list: Joi.string()
      .trim()
      .optional()
      .description(
        'Reference to a predefined list of options for select components'
      )
  })
  .unknown(true)

export const componentSchemaV2 = componentSchema
  .keys({
    id: idSchema.description('Unique identifier for the component'),
    list: Joi.string()
      .when('/lists', {
        is: Joi.exist(),
        then: Joi.valid(listIdRef)
      })
      .optional()
      .description(
        'List id reference to a predefined list of options for select components'
      )
      .error(checkErrors(FormDefinitionError.RefPageComponentList))
  })
  .description('Component schema for V2 forms')

export const componentPayloadSchemaV2 = componentSchema
  .keys({
    id: idSchema.description('Unique identifier for the component'),
    list: Joi.string()
      .optional()
      .description(
        'List id reference to a predefined list of options for select components'
      )
  })
  .description('Payload schema for component for V2 forms')

export const fileUploadComponentSchema = componentSchemaV2.keys({
  type: Joi.string<ComponentType.FileUploadField>()
    .trim()
    .valid(ComponentType.FileUploadField)
    .required()
    .description('Component that can only be a FileUploadField')
})

export const contentComponentSchema = componentSchemaV2.keys({
  type: Joi.string<ComponentType>()
    .trim()
    .valid(ComponentType.Details)
    .valid(ComponentType.Html)
    .valid(ComponentType.Markdown)
    .valid(ComponentType.InsetText)
    .valid(ComponentType.List)
    .required()
    .description('Content only component type (Details, Html, Markdown, etc.)')
})

const nextSchema = Joi.object<Link>()
  .description('Navigation link defining where to go after completing a page')
  .keys({
    path: Joi.string()
      .trim()
      .required()
      .description('The target page path to navigate to'),
    condition: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description(
        'Optional condition that determines if this path should be taken'
      ),
    redirect: Joi.string()
      .trim()
      .optional()
      .description(
        'Optional external URL to redirect to instead of an internal page'
      )
  })

const repeatOptions = Joi.object<RepeatOptions>()
  .description('Configuration options for a repeatable page section')
  .keys({
    name: Joi.string()
      .trim()
      .required()
      .description(
        'Identifier for the repeatable section, used in data structure'
      ),
    title: Joi.string()
      .trim()
      .required()
      .description('Title displayed for each repeatable item')
  })

const repeatSchema = Joi.object<RepeatSchema>()
  .description('Validation rules for a repeatable section')
  .keys({
    min: Joi.number()
      .empty('')
      .min(MIN_NUMBER_OF_REPEAT_ITEMS)
      .required()
      .description('Minimum number of repetitions required'),
    max: Joi.number()
      .empty('')
      .min(Joi.ref('min'))
      .max(MAX_NUMBER_OF_REPEAT_ITEMS)
      .required()
      .description('Maximum number of repetitions allowed')
  })

export const pageRepeatSchema = Joi.object<Repeat>()
  .description('Complete configuration for a repeatable page')
  .keys({
    options: repeatOptions
      .required()
      .description('Display and identification options for the repetition'),
    schema: repeatSchema
      .required()
      .description('Validation constraints for the number of repetitions')
  })

const eventSchema = Joi.object<Event>()
  .description('Event handler configuration for page lifecycle events')
  .keys({
    type: Joi.string()
      .trim()
      .allow('http')
      .required()
      .description(
        'Type of the event handler (currently only "http" supported)'
      ),
    options: Joi.object<EventOptions>()
      .description('Options specific to the event handler type')
      .keys({
        method: Joi.string()
          .trim()
          .allow('POST')
          .required()
          .description('HTTP method to use for the request'),
        url: Joi.string()
          .trim()
          .uri({ scheme: ['http', 'https'] })
          .required()
          .description('URL endpoint to call when the event fires')
      })
  })

const eventsSchema = Joi.object<Events>()
  .description(
    'Collection of event handlers for different page lifecycle events'
  )
  .keys({
    onLoad: eventSchema
      .optional()
      .description('Event handler triggered when the page is loaded'),
    onSave: eventSchema
      .optional()
      .description('Event handler triggered when the page data is saved')
  })

export const pageUploadComponentsSchema = Joi.array<
  FileUploadFieldComponent | ContentComponentsDef
>()
  .items(
    fileUploadComponentSchema.required(),
    contentComponentSchema.optional()
  )
  .unique('id')
  .unique('name', { ignoreUndefined: true })
  .min(1)
  .max(2)
  .description('Components allowed on Page Upload schema')

/**
 * `/status` is a special route for providing a user's application status.
 *  It should not be configured via the designer.
 */
export const pageSchema = Joi.object<Page>()
  .description('Form page definition specifying content and behavior')
  .keys({
    id: idSchemaOptional.description('Unique identifier for the page'),
    path: Joi.string()
      .trim()
      .required()
      .disallow('/status')
      .description(
        'URL path for this page, must not be the reserved "/status" path'
      ),
    title: Joi.string()
      .trim()
      .required()
      .description('Page title displayed at the top of the page'),
    section: Joi.string().trim().description('Section this page belongs to'),
    controller: Joi.string()
      .trim()
      .optional()
      .description('Custom controller class name for special page behavior'),
    components: Joi.array<ComponentDef>()
      .items(componentSchema)
      .unique('name')
      .description('UI components displayed on this page'),
    repeat: Joi.when('controller', {
      is: Joi.string().trim().valid('RepeatPageController').required(),
      then: pageRepeatSchema
        .required()
        .description(
          'Configuration for repeatable pages, required when using RepeatPageController'
        ),
      otherwise: Joi.any().strip()
    }),
    condition: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description('Optional condition that determines if this page is shown'),
    next: Joi.array<Link>()
      .items(nextSchema)
      .default([])
      .description('Possible navigation paths after this page'),
    events: eventsSchema
      .optional()
      .description('Event handlers for page lifecycle events'),
    view: Joi.string()
      .trim()
      .optional()
      .description(
        'Optional custom view template to use for rendering this page'
      )
  })

/**
 * V2 engine schema - used with new editor
 */
export const pageSchemaV2 = pageSchema
  .append({
    id: idSchema.description('Unique identifier for the page'),
    title: Joi.string()
      .trim()
      .allow('')
      .required()
      .description(
        'Page title displayed at the top of the page (with support for empty titles in V2)'
      ),
    components: Joi.when('controller', {
      switch: [
        {
          is: Joi.string().trim().valid(ControllerType.FileUpload).required(),
          then: pageUploadComponentsSchema
        }
      ],
      otherwise: Joi.array<ComponentDef>()
        .items(componentSchemaV2)
        .unique('id')
        .unique('name', { ignoreUndefined: true })
        .description('Components schema for V2 forms')
        .error(
          checkErrors([
            FormDefinitionError.UniquePageComponentId,
            FormDefinitionError.UniquePageComponentName
          ])
        )
    }),
    condition: Joi.string()
      .trim()
      .when('/conditions', {
        is: Joi.exist(),
        then: Joi.valid(conditionIdRef)
      })
      .optional()
      .description('Optional condition that determines if this page is shown')
      .error(checkErrors(FormDefinitionError.RefPageCondition))
  })
  .description('Page schema for V2 forms')

export const pagePayloadSchemaV2 = pageSchemaV2
  .append({
    components: Joi.when('controller', {
      switch: [
        {
          is: Joi.string().trim().valid(ControllerType.FileUpload).required(),
          then: pageUploadComponentsSchema
        }
      ],
      otherwise: Joi.array<ComponentDef>()
        .items(componentPayloadSchemaV2)
        .unique('id')
        .unique('name')
        .description('Components schema for V2 forms')
    })
  })
  .description('Payload Page schema for V2 forms')

const baseListItemSchema = Joi.object<Item>()
  .description('Base schema for list items with common properties')
  .keys({
    id: idSchema.description('Unique identifier for the list item'),
    text: Joi.string()
      .trim()
      .allow('')
      .description('Display text shown to the user'),
    description: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description('Optional additional descriptive text for the item'),
    conditional: Joi.object<Item['conditional']>()
      .description('Optional components to show when this item is selected')
      .keys({
        components: Joi.array<ComponentDef>()
          .required()
          .items(componentSchema.unknown(true))
          .unique('name')
          .description('Components to display conditionally')
      })
      .optional(),
    condition: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description('Condition that determines if this item is shown'),
    hint: Joi.object<Item['hint']>()
      .optional()
      .keys({
        id: idSchema,
        text: Joi.string().trim()
      })
      .description('Optional hint text to be shown on list item')
  })

const stringListItemSchema = baseListItemSchema
  .append({
    value: Joi.string()
      .trim()
      .required()
      .description('String value stored when this item is selected')
  })
  .description('List item with string value')

const numberListItemSchema = baseListItemSchema
  .append({
    value: Joi.number()
      .required()
      .description('Numeric value stored when this item is selected')
  })
  .description('List item with numeric value')

export const listSchema = Joi.object<List>()
  .description('Reusable list of options for select components')
  .keys({
    id: idSchemaOptional.description('Unique identifier for the list'),
    name: Joi.string()
      .trim()
      .required()
      .description('Name used to reference this list from components'),
    title: Joi.string()
      .trim()
      .required()
      .description('Human-readable title for the list'),
    type: Joi.string()
      .trim()
      .required()
      .valid('string', 'number')
      .description('Data type for list values (string or number)'),
    items: Joi.when('type', {
      is: 'string',
      then: Joi.array()
        .items(stringListItemSchema)
        .unique('id')
        .unique('text')
        .unique('value')
        .description('Array of items with string values')
        .error(
          checkErrors([
            FormDefinitionError.UniqueListItemId,
            FormDefinitionError.UniqueListItemText,
            FormDefinitionError.UniqueListItemValue
          ])
        ),
      otherwise: Joi.array()
        .items(numberListItemSchema)
        .unique('id')
        .unique('text')
        .unique('value')
        .description('Array of items with numeric values')
        .error(
          checkErrors([
            FormDefinitionError.UniqueListItemId,
            FormDefinitionError.UniqueListItemText,
            FormDefinitionError.UniqueListItemValue
          ])
        )
    })
  })

/**
 * V2 Joi schema for Lists
 */
export const listSchemaV2 = listSchema
  .keys({
    id: idSchema.description('Unique identifier for the list')
  })
  .description('List schema for V2 forms')

const feedbackSchema = Joi.object<FormDefinition['feedback']>()
  .description('Feedback configuration for the form')
  .keys({
    feedbackForm: Joi.boolean()
      .default(false)
      .description('Whether to show the built-in feedback form'),
    url: Joi.when('feedbackForm', {
      is: Joi.boolean().valid(false),
      then: Joi.string()
        .trim()
        .optional()
        .allow('')
        .description(
          'URL to an external feedback form when not using built-in feedback'
        )
    }),
    emailAddress: Joi.string()
      .trim()
      .email({
        tlds: {
          allow: false
        }
      })
      .optional()
      .description('Email address where feedback is sent')
  })

const phaseBannerSchema = Joi.object<PhaseBanner>()
  .description('Phase banner configuration showing development status')
  .keys({
    phase: Joi.string()
      .trim()
      .valid('alpha', 'beta')
      .description('Development phase of the service (alpha or beta)')
  })

const outputSchema = Joi.object<FormDefinition['output']>()
  .description('Configuration for form submission output')
  .keys({
    audience: Joi.string()
      .trim()
      .valid('human', 'machine')
      .required()
      .description(
        'Target audience for the output (human readable or machine processable)'
      ),
    version: Joi.string()
      .trim()
      .required()
      .description('Version identifier for the output format')
  })

/**
 * Joi schema for `FormDefinition` interface
 * @see {@link FormDefinition}
 */
export const formDefinitionSchema = Joi.object<FormDefinition>()
  .description('Complete form definition describing all aspects of a form')
  .required()
  .keys({
    engine: Joi.string()
      .trim()
      .allow('V1', 'V2')
      .default('V1')
      .description('Form engine version to use (V1 or V2)'),
    schema: Joi.number()
      .integer()
      .valid(SchemaVersion.V1)
      .default(SchemaVersion.V1)
      .description('Form schema version to use (1 or 2)'),
    name: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description('Unique name identifying the form'),
    feedback: feedbackSchema
      .optional()
      .description('Feedback mechanism configuration'),
    startPage: Joi.string()
      .trim()
      .optional()
      .description('Path of the first page to show when starting the form'),
    pages: Joi.array<Page>()
      .required()
      .items(pageSchema)
      .description('Pages schema for V1 forms')
      .unique('path'),
    sections: Joi.array<Section>()
      .items(sectionsSchema)
      .unique('name')
      .unique('title')
      .required()
      .description('Sections grouping related pages together')
      .error(
        checkErrors([
          FormDefinitionError.UniqueSectionName,
          FormDefinitionError.UniqueSectionTitle
        ])
      ),
    conditions: Joi.array<ConditionWrapper>()
      .items(conditionWrapperSchema)
      .unique('name')
      .unique('displayName')
      .description('Named conditions used for form logic'),
    lists: Joi.array<List>()
      .items(listSchema)
      .unique('name')
      .unique('title')
      .description('Reusable lists of options for select components'),
    metadata: Joi.object({ a: Joi.any() })
      .unknown()
      .optional()
      .description('Custom metadata for the form'),
    declaration: Joi.string()
      .trim()
      .allow('')
      .optional()
      .description('Declaration text shown on the summary page'),
    skipSummary: Joi.any()
      .strip()
      .description('option to skip the summary page'),
    phaseBanner: phaseBannerSchema
      .optional()
      .description('Phase banner configuration'),
    outputEmail: Joi.string()
      .trim()
      .email({ tlds: { allow: ['uk'] } })
      .optional()
      .description('Email address where form submissions are sent'),
    output: outputSchema
      .optional()
      .description('Configuration for submission output format'),
    outputs: Joi.array()
      .items({
        emailAddress: Joi.string()
          .trim()
          .email({ tlds: { allow: ['uk'] } })
          .description('Email address where form submissions are sent'),
        audience: Joi.string()
          .trim()
          .valid('human', 'machine')
          .required()
          .description(
            'Target audience for the output (human readable or machine processable)'
          ),
        version: Joi.string()
          .trim()
          .required()
          .description('Version identifier for the output format')
      })
      .optional()
      .description('One or more email targets/types for submission emails')
  })

export const formDefinitionV2Schema = formDefinitionSchema
  .keys({
    schema: Joi.number()
      .integer()
      .valid(SchemaVersion.V2)
      .description('Form schema version to use (2)'),
    pages: Joi.array<Page>()
      .items(pageSchemaV2)
      .required()
      .unique('id')
      .unique('path')
      .description('Pages schema for V2 forms')
      .error(
        checkErrors([
          FormDefinitionError.UniquePageId,
          FormDefinitionError.UniquePagePath
        ])
      ),
    lists: Joi.array<List>()
      .items(listSchemaV2)
      .unique('id')
      .unique('name')
      .unique('title')
      .description('Lists schema for V2 forms')
      .error(
        checkErrors([
          FormDefinitionError.UniqueListId,
          FormDefinitionError.UniqueListName,
          FormDefinitionError.UniqueListTitle
        ])
      ),
    conditions: Joi.array<ConditionWrapperV2>()
      .items(conditionWrapperSchemaV2)
      .unique('id')
      .unique('displayName')
      .description('Named conditions used for form logic')
      .error(
        checkErrors([
          FormDefinitionError.UniqueConditionId,
          FormDefinitionError.UniqueConditionDisplayName
        ])
      )
  })
  .description('Form definition schema for V2')

// Maintain compatibility with legacy named export
// E.g. `import { Schema } from '@defra/forms-model'`
export const Schema = formDefinitionSchema
