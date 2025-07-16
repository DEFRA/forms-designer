import { ComponentTypes } from '~/src/components/component-types.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  type ComponentDef,
  type ConditionalComponentType,
  type ConditionalComponentsDef,
  type ContentComponentsDef,
  type FormComponentsDef,
  type HtmlComponent,
  type InputFieldsComponentsDef,
  type InsetTextComponent,
  type ListComponent,
  type ListComponentsDef,
  type MarkdownComponent,
  type SelectionComponentsDef
} from '~/src/components/types.js'

/**
 * Return component defaults by type
 */
export function getComponentDefaults<FieldType extends ComponentDef>(
  component?: Pick<FieldType, 'type'>
) {
  const defaults = ComponentTypes.find(({ type }) => type === component?.type)

  if (!defaults) {
    throw new Error(
      `Defaults not found for component type '${component?.type}'`
    )
  }

  return structuredClone(defaults) as FieldType
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
    ComponentType.AutocompleteField,
    ComponentType.RadiosField,
    ComponentType.CheckboxesField,
    ComponentType.DatePartsField,
    ComponentType.EmailAddressField,
    ComponentType.MultilineTextField,
    ComponentType.TelephoneNumberField,
    ComponentType.NumberField,
    ComponentType.SelectField,
    ComponentType.TextField,
    ComponentType.YesNoField
  ]

  return !!type && allowedTypes.includes(type)
}

/**
 * Check if the component type is supported for conditional reveal.
 * As of today this is just content types, but we're providing this as a wrapper
 * function for clarity.
 * @param type - Component type to check
 */
export function isConditionalRevealType(type: ComponentType) {
  return isContentType(type)
}

/**
 * Filter known components with content (textarea or list)
 */
export function hasContent(
  component?: Partial<ComponentDef>
): component is ContentComponentsDef {
  return isContentType(component?.type)
}

/**
 * Filter known components with content textarea
 */
export function hasContentField(
  component?: Partial<ComponentDef>
): component is Exclude<ContentComponentsDef, ListComponent> {
  const deniedTypes = [ComponentType.List]
  return hasContent(component) && !deniedTypes.includes(component.type)
}

export function isContentType(
  type?: ComponentType
): type is ContentComponentsDef['type'] {
  const allowedTypes = [
    ComponentType.Details,
    ComponentType.Html,
    ComponentType.Markdown,
    ComponentType.InsetText,
    ComponentType.List
  ]

  return !!type && allowedTypes.includes(type)
}

/**
 * Filter known components with form fields
 * (includes input fields and selection fields)
 */
export function hasFormField(
  component?: Partial<ComponentDef>
): component is FormComponentsDef {
  return isFormType(component?.type)
}

export function isFormType(
  type?: ComponentType
): type is FormComponentsDef['type'] {
  return !!type && !isContentType(type)
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
 * Filter known form components with input fields
 * (excludes content and selection fields)
 */
export function hasInputField(
  component?: Partial<ComponentDef>
): component is InputFieldsComponentsDef {
  return hasFormField(component) && !hasSelectionFields(component)
}

/**
 * Filter known form components with selection fields
 * (excludes content and input fields)
 */
export function hasSelectionFields(
  component?: Partial<ComponentDef>
): component is SelectionComponentsDef {
  const allowedTypes = [
    ComponentType.AutocompleteField,
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
): component is Exclude<
  ComponentDef,
  InsetTextComponent | HtmlComponent | MarkdownComponent
> {
  const deniedTypes = [
    ComponentType.InsetText,
    ComponentType.Html,
    ComponentType.Markdown
  ]
  return !!component?.type && !deniedTypes.includes(component.type)
}

/**
 * Filter known components with hint text
 */
export function hasHint(
  component?: Partial<ComponentDef>
): component is FormComponentsDef | ListComponent {
  return isFormType(component?.type) || component?.type === ComponentType.List
}
