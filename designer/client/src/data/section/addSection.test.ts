import { type FormDefinition, type Section } from '@defra/forms-model'

import { addSection } from '~/src/data/section/addSection.js'

const data = {
  conditions: [],
  lists: [],
  pages: [],
  sections: [
    {
      title: 'your details',
      name: 'yourDetails'
    }
  ]
} satisfies FormDefinition

test('addSection throws if a section with the same name already exists', () => {
  expect(() =>
    addSection(data, { name: 'yourDetails', title: 'your details' })
  ).toThrow(/A section with the name/)
})

test('addSection adds a section if the section does not exist', () => {
  const newSection: Section = { name: 'newSection', title: 'new section' }
  expect(addSection(data, newSection).sections).toEqual([
    {
      title: 'your details',
      name: 'yourDetails'
    },
    newSection
  ])
})
