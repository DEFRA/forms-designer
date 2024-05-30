import { type FormDefinition } from '@defra/forms-model'

import { addComponent } from '~/src/data/index.js'

test('addComponent throws an error when no page can be found', () => {
  const data: FormDefinition = {
    pages: [],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }

  // @ts-expect-error - Allow invalid component for test
  expect(() => addComponent(data, 'doesntExist', {})).toThrow()
})

test('addComponent adds a component to the correct page', () => {
  const data: FormDefinition = {
    pages: [
      {
        title: 'first page',
        path: '/1',
        components: [
          {
            type: 'TextField',
            name: 'firstName',
            title: 'First name',
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
            type: 'TextField',
            name: 'lastName',
            title: 'Surname',
            options: {},
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  }

  expect(
    addComponent(data, '/1', {
      type: 'TextField',
      name: 'aNewComponent',
      title: 'new component',
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
            type: 'TextField',
            name: 'firstName',
            title: 'First name',
            options: {},
            schema: {}
          },
          {
            type: 'TextField',
            name: 'aNewComponent',
            title: 'new component',
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
            type: 'TextField',
            name: 'lastName',
            title: 'Surname',
            options: {},
            schema: {}
          }
        ]
      }
    ],
    lists: [],
    sections: [],
    conditions: [],
    outputs: []
  })
})
