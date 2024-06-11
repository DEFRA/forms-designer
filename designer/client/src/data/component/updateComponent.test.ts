import { ComponentType, type FormDefinition } from '@defra/forms-model'

import { updateComponent } from '~/src/data/component/updateComponent.js'

test('updateComponent throws an error when the target component cannot be found', () => {
  const data: FormDefinition = {
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
      { title: '2', path: '/2' }
    ],
    lists: [],
    sections: [],
    conditions: []
  }

  // @ts-expect-error - Allow invalid component for test
  expect(() => updateComponent(data, '/2', 'doesntExist', {})).toThrow()

  // @ts-expect-error - Allow invalid component for test
  expect(() => updateComponent(data, '/3', 'doesntExist', {})).toThrow()
})

test('addComponent adds a component to the correct page', () => {
  const data: FormDefinition = {
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
  }

  expect(
    updateComponent(data, '/1', 'firstName', {
      name: 'fullName',
      title: 'full name',
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
