import {
  ComponentType,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'

import { updateComponents } from '~/src/data/component/updateComponents.js'

test('updateComponents throws an error when no page components can be found', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(() => updateComponents(data, data.pages[0], [])).toThrow()
})

test('updateComponents updates components for the correct page', () => {
  const components1 = [
    {
      name: 'firstName',
      title: 'First name',
      type: ComponentType.TextField,
      options: {},
      schema: {}
    }
  ] satisfies ComponentDef[]

  const components2 = [
    {
      name: 'lastName',
      title: 'Surname',
      type: ComponentType.TextField,
      options: {},
      schema: {}
    }
  ] satisfies ComponentDef[]

  const data = {
    pages: [
      {
        title: 'first page',
        path: '/1',
        next: [],
        components: components1
      },
      {
        title: 'second page',
        path: '/2',
        next: [],
        components: components2
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(
    updateComponents(data, data.pages[0], components2)
  ).toEqual<FormDefinition>({
    pages: [
      {
        title: 'first page',
        path: '/1',
        next: [],
        components: components2
      },
      {
        title: 'second page',
        path: '/2',
        next: [],
        components: components2
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  })
})
