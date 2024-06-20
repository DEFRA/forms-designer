import {
  ComponentSubType,
  ComponentType,
  type ComponentDef
} from '@defra/forms-model'

import { isNotContentType } from '~/src/data/helpers.js'

describe('Type guards', () => {
  describe('isNotContentType', () => {
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
        list: 'items',
        options: {},
        schema: {}
      } satisfies ComponentDef
    ])('should allow non-content types', (component) => {
      const { type } = component

      expect({ isNotContentType: true, type }).toEqual({
        isNotContentType: isNotContentType(component),
        type
      })
    })

    it.each([
      {
        name: 'content',
        title: 'Help with nationality',
        type: ComponentType.Details,
        content: 'We need to know your nationality so we can work out…',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: 'HTML',
        type: ComponentType.Html,
        content: '<p class="govuk-body">Some content</p>',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        name: 'content',
        title: '',
        type: ComponentType.InsetText,
        content: 'It can take up to 8 weeks to register a lasting power of…',
        options: {},
        schema: {}
      } satisfies ComponentDef
    ])('should prevent content types', (component) => {
      const { type } = component

      expect({ isNotContentType: false, type }).toEqual({
        isNotContentType: isNotContentType(component),
        type
      })
    })
  })
})
