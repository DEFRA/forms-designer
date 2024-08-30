import { type FormDefinition, type Page } from '@defra/forms-model'

import { addLink } from '~/src/data/page/addLink.js'

const page404 = {
  title: 'Page not found',
  path: '/404',
  next: [],
  components: []
} satisfies Page

const pageEggScrambed = {
  title: 'Egg scrambled',
  path: '/scrambled',
  next: [{ path: '/poached' }],
  components: []
} satisfies Page

const pageEggPoached = {
  title: 'Egg poached',
  path: '/poached',
  next: [],
  components: []
} satisfies Page

const pageEggSunny = {
  title: 'Egg sunny side up',
  path: '/sunny',
  next: [],
  components: []
} satisfies Page

const data = {
  pages: [pageEggScrambed, pageEggPoached, pageEggSunny],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

test('addLink throws if to, from or both are not found', () => {
  expect(() => addLink(data, page404, pageEggScrambed)).toThrow(
    "Page not found for path '/404'"
  )

  expect(() => addLink(data, pageEggScrambed, page404)).toThrow(
    "Page not found for path '/404'"
  )

  expect(() =>
    addLink(data, pageEggScrambed, page404, {
      condition: 'isUnknown'
    })
  ).toThrow("Page not found for path '/404'")
})

test('addLink throws if to and from are equal', () => {
  expect(() => addLink(data, pageEggPoached, pageEggPoached)).toThrow(
    'Link must be between different pages'
  )
})

test('addLink successfully adds a new link', () => {
  const definition = addLink(data, pageEggPoached, pageEggSunny)

  expect(definition).toEqual<FormDefinition>({
    pages: [
      {
        title: 'Egg scrambled',
        path: '/scrambled',
        next: [{ path: '/poached' }],
        components: []
      },
      {
        title: 'Egg poached',
        path: '/poached',
        next: [{ path: '/sunny' }],
        components: []
      },
      {
        title: 'Egg sunny side up',
        path: '/sunny',
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  })
})

test('addLink does nothing happens if the link already exists', () => {
  const definition = addLink(data, pageEggScrambed, pageEggPoached)

  expect(definition).toEqual(data)
  expect(definition).toBe(data)
})
