import {
  ComponentSubType,
  ComponentType,
  type ComponentDef
} from '@defra/forms-model'

import { hasContentField } from '~/src/components/helpers.js'

describe('Type guards', () => {
  describe('hasContentField', () => {
    it.each([
      {
        name: 'field',
        title: 'Input',
        type: ComponentType.TextField,
        subType: ComponentSubType.Field,
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'field',
        title: 'Radios',
        type: ComponentType.RadiosField,
        subType: ComponentSubType.ListField,
        list: 'items',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'field',
        title: 'Checkboxes',
        type: ComponentType.CheckboxesField,
        subType: ComponentSubType.ListField,
        list: 'items',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'field',
        title: 'Items',
        type: ComponentType.List,
        subType: ComponentSubType.Content,
        list: 'items',
        options: {},
        schema: {}
      } satisfies ComponentDef
    ])('should allow non-content types', (component) => {
      const { type } = component

      expect({ hasContentField: false, type }).toEqual({
        hasContentField: hasContentField(component),
        type
      })
    })

    it.each([
      {
        name: 'content',
        title: 'Help with nationality',
        type: ComponentType.Details,
        subType: ComponentSubType.Content,
        content: 'We need to know your nationality so we can work out…',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: 'HTML',
        type: ComponentType.Html,
        subType: ComponentSubType.Content,
        content: '<p class="govuk-body">Some content</p>',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: '',
        type: ComponentType.InsetText,
        subType: ComponentSubType.Content,
        content: 'It can take up to 8 weeks to register a lasting power of…',
        options: {},
        schema: {}
      } satisfies ComponentDef
    ])('should prevent content types', (component) => {
      const { type } = component

      expect({ hasContentField: true, type }).toEqual({
        hasContentField: hasContentField(component),
        type
      })
    })
  })
})
