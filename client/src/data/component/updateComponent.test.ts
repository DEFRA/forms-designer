import { ComponentType, type FormDefinition } from '@defra/forms-model'

import { updateComponent } from '~/src/data/component/updateComponent.js'

test('updateComponent throws an error when the target component cannot be found', () => {
  const data = {
    startPage: '/1',
    pages: [
      {
        title: 'first page',
        path: '/1',
        next: [{ path: '/2' }],
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
        title: '2',
        path: '/2',
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  expect(() =>
    // @ts-expect-error - Allow invalid component for test
    updateComponent(data, data.pages[1], 'doesntExist', {})
  ).toThrow()

  expect(() =>
    // @ts-expect-error - Allow invalid component for test
    updateComponent(data, data.pages[2], 'doesntExist', {})
  ).toThrow()
})

test('addComponent adds a component to the correct page', () => {
  const data = {
    startPage: '/1',
    pages: [
      {
        title: 'first page',
        path: '/1',
        next: [{ path: '/2' }],
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
        next: [],
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
    updateComponent(data, data.pages[0], 'firstName', {
      name: 'fullName',
      title: 'full name',
      type: ComponentType.TextField,
      options: {},
      schema: {}
    })
  ).toEqual<FormDefinition>({
    startPage: '/1',
    pages: [
      {
        title: 'first page',
        path: '/1',
        next: [{ path: '/2' }],
        components: [
          {
            name: 'fullName',
            title: 'full name',
            type: ComponentType.TextField,
            options: {},
            schema: {}
          }
        ]
      },
      {
        title: 'second page',
        path: '/2',
        next: [],
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
