import { updateComponent } from '~/src/data/index.js'
import { FormDefinition } from '@defra/forms-model'

test('updateComponent throws an error when the target component cannot be found', () => {
  const data: FormDefinition = {
    conditions: [],
    lists: [],
    pages: [
      {
        title: 'first page',
        path: '/1',
        components: [
          {
            type: 'TextField',
            name: 'firstName',
            title: 'First name',
            schema: {}
          }
        ]
      },
      { title: '2', path: '/2' }
    ],
    sections: []
  }

  expect(() => {
    updateComponent(data, '/2', 'doesntExist', {})
  }).toThrow()
  expect(() => {
    updateComponent(data, '/3', 'doesntExist', {})
  }).toThrow()
})

test('addComponent adds a component to the correct page', () => {
  const data: FormDefinition = {
    conditions: [],
    lists: [],
    pages: [
      {
        title: 'first page',
        path: '/1',
        components: [
          {
            type: 'TextField',
            name: 'firstName',
            title: 'First name',
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
            schema: {}
          }
        ]
      }
    ],
    sections: []
  }

  expect(
    updateComponent(data, '/1', 'firstName', {
      type: 'TextField',
      name: 'fullName',
      title: 'full name',
      schema: {}
    })
  ).toEqual({
    conditions: [],
    lists: [],
    pages: [
      {
        title: 'first page',
        path: '/1',
        components: [
          {
            type: 'TextField',
            name: 'fullName',
            title: 'full name',
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
            schema: {}
          }
        ]
      }
    ],
    sections: []
  })
})
