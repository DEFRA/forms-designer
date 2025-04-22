import { ComponentType, type ComponentDef } from '@defra/forms-model'

import {
  getComponentsExcludingGuidance,
  hasContent,
  hasContentField
} from '~/src/components/helpers.js'

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

  describe('getComponentsExcludingGuidance()', () => {
    it('should return all components if no markdown at position zero', () => {
      const components: ComponentDef[] = [
        {
          name: 'textfield',
          title: 'What is your name?',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        },
        {
          name: 'textfield',
          title: 'What is your age?',
          type: ComponentType.NumberField,
          options: {},
          schema: {}
        }
      ]

      const expectedComponents = structuredClone(components)
      expect(getComponentsExcludingGuidance(components)).toEqual(
        expectedComponents
      )
    })

    it('should return only components that arent guidance', () => {
      const components: ComponentDef[] = [
        {
          name: 'guidance',
          title: 'Some guidance',
          type: ComponentType.Markdown,
          content: 'Guidance text',
          options: {}
        },
        {
          name: 'textfield',
          title: 'What is your name?',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        },
        {
          name: 'textfield',
          title: 'What is your age?',
          type: ComponentType.NumberField,
          options: {},
          schema: {}
        }
      ]

      const res = getComponentsExcludingGuidance(components)
      expect(res).toHaveLength(2)
      expect(res[0].title).toBe('What is your name?')
      expect(res[1].title).toBe('What is your age?')
    })
  })
})
