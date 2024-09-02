import {
  ComponentType,
  hasConditionSupport,
  hasFormField,
  hasListField,
  type ConditionalComponentsDef,
  type ConditionalComponentType,
  type FormDefinition,
  type Item,
  type PageWithComponents,
  type Section
} from '@defra/forms-model'

import { hasComponents } from '~/src/data/definition/hasComponents.js'
import { findList } from '~/src/data/list/findList.js'
import { findPathsTo } from '~/src/data/page/findPathsTo.js'
import { findSection } from '~/src/data/section/findSection.js'

/**
 * Find all form fields in the form definition
 * with conditional support
 */
export function getFields(data: FormDefinition) {
  return data.pages.filter(hasComponents).flatMap(pageToFields.bind(data))
}

/**
 * Find all form fields in the form definition
 * with conditional support, for a given path
 */
export function getFieldsTo(data: FormDefinition, pathTo?: string) {
  if (!pathTo) {
    return getFields(data)
  }

  const paths = findPathsTo(data, pathTo)
  const pages = data.pages.filter((page) => paths.includes(page.path))

  return getFields({ ...data, pages })
}

/**
 * Map page to conditional field definition
 */
export function pageToFields(this: FormDefinition, page: PageWithComponents) {
  const section = page.section ? findSection(this, page.section) : undefined

  return page.components
    .filter(hasConditionSupport)
    .filter(hasFormField)
    .map(componentToField.bind(this, section))
}

/**
 * Map component to conditional field definition
 */
export function componentToField(
  this: FormDefinition,
  section: Section | undefined,
  component: ConditionalComponentsDef
): FieldDef {
  const { name, title, type } = component

  const field: FieldDef = {
    label: section ? `${section.title}: ${title}` : title,
    name,
    type
  }

  if (component.type === ComponentType.YesNoField) {
    field.values = [
      {
        text: 'Yes',
        value: true
      },
      {
        text: 'No',
        value: false
      }
    ]
  }

  if (hasListField(component)) {
    field.values = findList(this, component.list).items
  }

  return field
}

export type FieldDef =
  | {
      label: string
      name: string
      type: ConditionalComponentType
      values?: Item[]
    }
  | {
      label: string
      name: string
      type: 'Condition'
    }