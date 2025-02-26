import { ComponentType, ControllerType } from '@defra/forms-model'

import { getPageNum } from '~/src/models/forms/editor-v2/common.js'

/**
 * @satisfies {FormDefinition}
 */
const formDefinitionWithSummary = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
const formDefinitionWithoutSummary = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

describe('editor-v2 - model', () => {
  test('should return page number if no real page id', () => {
    const pageNum = getPageNum(formDefinitionWithSummary, 'new')
    expect(pageNum).toBe(2)
  })
  test('should return page number if no real page id - when no summary page', () => {
    const pageNum = getPageNum(formDefinitionWithoutSummary, 'new')
    expect(pageNum).toBe(2)
  })
  test('should return page number if proper page id', () => {
    const pageNum = getPageNum(formDefinitionWithSummary, 'p1')
    expect(pageNum).toBe(1)
  })
  test('should return page number if proper page id - when no summary page', () => {
    const pageNum = getPageNum(formDefinitionWithoutSummary, 'p1')
    expect(pageNum).toBe(1)
  })
})

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
