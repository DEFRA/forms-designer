import { ComponentType, type FormDefinition } from '@defra/forms-model'

import { addComponent } from '~/src/data/component/addComponent.js'

test('addComponent throws an error when no page can be found', () => {
  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  // @ts-expect-error - Allow invalid component for test
  expect(() => addComponent(data, 'doesntExist', {})).toThrow()
})

test('addComponent adds a component to the correct page', () => {
  const data = {
    pages: [
      {
        title: 'first page',
        path: '/1',
        components: [
          {
            name: 'firstName',
            title: 'First name',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ]
      },
      {
        title: 'second page',
        path: '/2',
        components: [
          {
            name: 'lastName',
            title: 'Surname',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(
    addComponent(data, '/1', {
      name: 'aNewComponent',
      title: 'new component',
      type: ComponentType.TextField,
      options: {},
      schema: {}
    })
  ).toEqual<FormDefinition>({
    pages: [
      {
        title: 'first page',
        path: '/1',
        components: [
          {
            name: 'firstName',
            title: 'First name',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          },
          {
            name: 'aNewComponent',
            title: 'new component',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ]
      },
      {
        title: 'second page',
        path: '/2',
        components: [
          {
            name: 'lastName',
            title: 'Surname',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  })
})
