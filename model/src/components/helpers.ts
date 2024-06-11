import { ComponentType } from '~/src/components/enums.js'
import {
  type InputFieldsComponentsDef,
  type ComponentDef,
  type ConditionalComponentsDef,
  type ContentComponentsDef,
  type HtmlComponent,
  type InsetTextComponent,
  type ListComponentsDef,
  type SelectionComponentsDef,
  type EditorComponentsDef
} from '~/src/components/types.js'

/**
 * Filter known components with support for conditions
 */
export function hasConditionSupport(
  component?: Partial<ComponentDef>
): component is ConditionalComponentsDef {
  const allowedTypes = [
    ComponentType.CheckboxesField,
    ComponentType.DateField,
    ComponentType.DatePartsField,
    ComponentType.DateTimeField,
    ComponentType.DateTimePartsField,
    ComponentType.EmailAddressField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField,
    ComponentType.TextField,
    ComponentType.TimeField,
    ComponentType.YesNoField
  ]

  return !!component?.type && allowedTypes.includes(component.type)
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
    ComponentType.InsetText,
    ComponentType.List
  ]

  return !!component?.type && allowedTypes.includes(component.type)
}

/**
 * Filter known components with text editor
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
    ComponentType.FileUploadField,
    ComponentType.DatePartsField,
    ComponentType.DateTimeField,
    ComponentType.DateTimePartsField,
    ComponentType.DateField
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
    ComponentType.FileUploadField,
    ComponentType.DateField,
    ComponentType.DateTimeField,
    ComponentType.DateTimePartsField,
    ComponentType.MonthYearField,
    ComponentType.TimeField,
    ComponentType.UkAddressField,
    ComponentType.WebsiteField
  ]

  return !!component?.type && allowedTypes.includes(component.type)
}

/**
 * Filter known components with lists
 */
export function hasListField(
  component?: Partial<ComponentDef>
): component is ListComponentsDef {
  const allowedTypes = [
    ComponentType.AutocompleteField,
    ComponentType.List,
    ComponentType.RadiosField,
    ComponentType.SelectField,
    ComponentType.CheckboxesField
  ]

  return !!component?.type && allowedTypes.includes(component.type)
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
