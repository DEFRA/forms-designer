import { type ComponentDef } from '@defra/forms-model'

import { isNotContentType } from '~/src/data/helpers.js'

describe('Type guards', () => {
  describe('isNotContentType', () => {
    it.each([
      {
        type: 'TextField',
        title: 'Input',
        name: 'field',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        type: 'RadiosField',
        subType: 'listField',
        title: 'Radios',
        list: 'items',
        name: 'field',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        type: 'CheckboxesField',
        subType: 'listField',
        title: 'Checkboxes',
        list: 'items',
        name: 'field',
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
        type: 'Details',
        title: 'Help with nationality',
        content: 'We need to know your nationality so we can work out…',
        name: 'content',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        type: 'Html',
        title: 'HTML',
        content: '<p class="govuk-body">Some content</p>',
        name: 'content',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        type: 'InsetText',
        title: '',
        content: 'It can take up to 8 weeks to register a lasting power of…',
        name: 'content',
        options: {},
        schema: {}
      } satisfies ComponentDef,
      {
        type: 'List',
        title: 'Items',
        list: 'items',
        name: 'field',
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
