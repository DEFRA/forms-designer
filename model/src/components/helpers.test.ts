import { ComponentType } from '~/src/components/enums.js'
import {
  hasContent,
  hasContentField,
  isConditionalRevealType
} from '~/src/components/helpers.js'
import { type ComponentDef } from '~/src/components/types.js'

describe('Type guards', () => {
  describe('hasContent', () => {
    it.each([
      {
        name: 'field',
        title: 'Input',
        type: ComponentType.TextField,
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'field',
        title: 'Radios',
        type: ComponentType.RadiosField,
        list: 'items',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'field',
        title: 'Checkboxes',
        type: ComponentType.CheckboxesField,
        list: 'items',
        options: {}
      } satisfies ComponentDef
    ])('should prevent non-content types', (component) => {
      const { type } = component

      expect({ hasContent: false, type }).toEqual({
        hasContent: hasContent(component),
        type
      })
    })

    it.each([
      {
        name: 'content',
        title: 'Help with nationality',
        type: ComponentType.Details,
        content: 'We need to know your nationality so we can work out…',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: 'HTML',
        type: ComponentType.Html,
        content: '<p class="govuk-body">Some content</p>',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: 'Markdown',
        type: ComponentType.Markdown,
        content: '<p class="govuk-body">Some content</p>',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: '',
        type: ComponentType.InsetText,
        content: 'It can take up to 8 weeks to register a lasting power of…'
      } satisfies ComponentDef,
      {
        name: 'field',
        title: 'Items',
        type: ComponentType.List,
        list: 'items',
        options: {}
      } satisfies ComponentDef
    ])('should allow content types', (component) => {
      const { type } = component

      expect({ hasContent: true, type }).toEqual({
        hasContent: hasContent(component),
        type
      })
    })
  })

  describe('hasContentField', () => {
    it.each([
      {
        name: 'content',
        title: 'Help with nationality',
        type: ComponentType.Details,
        content: 'We need to know your nationality so we can work out…',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: 'HTML',
        type: ComponentType.Html,
        content: '<p class="govuk-body">Some content</p>',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: 'Markdown',
        type: ComponentType.Markdown,
        content: '<p class="govuk-body">Some content</p>',
        options: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: '',
        type: ComponentType.InsetText,
        content: 'It can take up to 8 weeks to register a lasting power of…'
      } satisfies ComponentDef
    ])('should allow content types with textarea field', (component) => {
      const { type } = component

      expect({ hasContentField: true, type }).toEqual({
        hasContentField: hasContentField(component),
        type
      })
    })

    it.each([
      {
        name: 'field',
        title: 'Items',
        type: ComponentType.List,
        list: 'items',
        options: {}
      } satisfies ComponentDef
    ])('should prevent content types with list', (component) => {
      const { type } = component

      expect({ hasContentField: false, type }).toEqual({
        hasContentField: hasContentField(component),
        type
      })
    })
  })
})

describe('isConditionalRevealType', () => {
  it.each([
    ComponentType.Details,
    ComponentType.Html,
    ComponentType.Markdown,
    ComponentType.InsetText,
    ComponentType.List
  ])('should return true for content types: %s', (type) => {
    expect(isConditionalRevealType(type)).toBe(true)
  })

  it.each([
    ComponentType.TextField,
    ComponentType.RadiosField,
    ComponentType.CheckboxesField,
    ComponentType.DatePartsField,
    ComponentType.EmailAddressField,
    ComponentType.MultilineTextField,
    ComponentType.TelephoneNumberField,
    ComponentType.NumberField,
    ComponentType.SelectField,
    ComponentType.YesNoField,
    ComponentType.AutocompleteField
  ])('should return false for non-content types: %s', (type) => {
    expect(isConditionalRevealType(type)).toBe(false)
  })
})
