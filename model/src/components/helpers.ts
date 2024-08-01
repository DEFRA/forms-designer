import { ComponentTypes } from '~/src/components/component-types.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  type InputFieldsComponentsDef,
  type ComponentDef,
  type ConditionalComponentsDef,
  type ConditionalComponentType,
  type ContentComponentsDef,
  type HtmlComponent,
  type InsetTextComponent,
  type ListComponentsDef,
  type SelectionComponentsDef,
  type EditorComponentsDef
} from '~/src/components/types.js'

/**
 * Return component defaults by type
 */
export function getComponentDefaults(component?: Partial<ComponentDef>) {
  if (!component?.type) {
    return
  }

  return ComponentTypes.find(({ type }) => type === component.type)
}

/**
 * Filter known components with support for conditions
 */
export function hasConditionSupport(
  component?: Partial<ComponentDef>
): component is ConditionalComponentsDef {
  return isConditionalType(component?.type)
}

export function isConditionalType(
  type?: ComponentType
): type is ConditionalComponentType {
  const allowedTypes = [
    ComponentType.RadiosField,
    ComponentType.CheckboxesField,
    ComponentType.DatePartsField,
    ComponentType.EmailAddressField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField,
    ComponentType.SelectField,
    ComponentType.TextField,
    ComponentType.YesNoField
  ]

  return !!type && allowedTypes.includes(type)
}

/**
 * Filter known components with content fields
 */
export function hasContentField(
  component?: Partial<ComponentDef>
): component is ContentComponentsDef {
  const allowedTypes = [
    ComponentType.Details,
    ComponentType.Html,
    ComponentType.InsetText
  ]

  return !!component?.type && allowedTypes.includes(component.type)
}

/**
 * Filter known components with text editor or list select
 */
export function hasEditor(
  component?: Partial<ComponentDef>
): component is EditorComponentsDef {
  const allowedTypes = [
    ComponentType.TextField,
    ComponentType.EmailAddressField,
    ComponentType.TelephoneNumberField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField,
    ComponentType.AutocompleteField,
    ComponentType.SelectField,
    ComponentType.RadiosField,
    ComponentType.CheckboxesField,
    ComponentType.List,
    ComponentType.Details,
    ComponentType.Html,
    ComponentType.InsetText,
    ComponentType.DatePartsField
  ]

  return !!component?.type && allowedTypes.includes(component.type)
}

/**
 * Filter known components with input fields
 */
export function hasInputField(
  component?: Partial<ComponentDef>
): component is InputFieldsComponentsDef {
  const allowedTypes = [
    ComponentType.TextField,
    ComponentType.EmailAddressField,
    ComponentType.NumberField,
    ComponentType.MultilineTextField,
    ComponentType.TelephoneNumberField,
    ComponentType.YesNoField,
    ComponentType.MonthYearField,
    ComponentType.DatePartsField,
    ComponentType.UkAddressField
  ]

  return !!component?.type && allowedTypes.includes(component.type)
}

/**
 * Filter known components with lists
 */
export function hasListField(
  component?: Partial<ComponentDef>
): component is ListComponentsDef {
  return isListType(component?.type)
}

export function isListType(
  type?: ComponentType
): type is ListComponentsDef['type'] {
  const allowedTypes = [
    ComponentType.AutocompleteField,
    ComponentType.List,
    ComponentType.RadiosField,
    ComponentType.SelectField,
    ComponentType.CheckboxesField
  ]

  return !!type && allowedTypes.includes(type)
}

/**
 * Filter known components with selection fields
 */
export function hasSelectionFields(
  component?: Partial<ComponentDef>
): component is SelectionComponentsDef {
  const allowedTypes = [
    ComponentType.CheckboxesField,
    ComponentType.RadiosField,
    ComponentType.SelectField,
    ComponentType.YesNoField
  ]

  return !!component?.type && allowedTypes.includes(component.type)
}

/**
 * Filter known components with titles
 */
export function hasTitle(
  component?: Partial<ComponentDef>
): component is Exclude<ComponentDef, InsetTextComponent | HtmlComponent> {
  const deniedTypes = [ComponentType.InsetText, ComponentType.Html]
  return !!component?.type && !deniedTypes.includes(component.type)
}
