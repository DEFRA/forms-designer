import { camelCase, controllerNameFromPath, isEmpty } from '~/src/helpers.js'

describe('helpers', () => {
  describe('camelCase', () => {
    test('should camel case string', () => {
      expect(camelCase('My page')).toBe('myPage')
    })

    test('should camel case string with leading space', () => {
      expect(camelCase(' My page')).toBe('myPage')
    })

    test('should camel case hyphenated string', () => {
      expect(camelCase('My-page')).toBe('myPage')
    })

    test('should camel case underscored string', () => {
      expect(camelCase('My_page')).toBe('myPage')
    })

    test('should camel case string with special chars', () => {
      expect(camelCase('My page!$£')).toBe('myPage')
    })

    test('should camel case string with apostrophes chars', () => {
      expect(camelCase("Bob's your uncle")).toBe('bobsYourUncle')
    })
  })

  describe('isEmpty', () => {
    test('should return the correct value', () => {
      expect(isEmpty(1)).toBeFalsy()
      expect(isEmpty(0)).toBeFalsy()
      expect(isEmpty(-0)).toBeFalsy()
      expect(isEmpty('boop')).toBeFalsy()

      expect(isEmpty('')).toBeTruthy()
      expect(isEmpty(``)).toBeTruthy()
      expect(isEmpty(undefined)).toBeTruthy()
    })
  })

  describe('controllerNameFromPath', () => {
    const controllers = [
      {
        name: 'StartPageController',
        path: './pages/start.js'
      },
      {
        name: 'SummaryPageController',
        path: './pages/summary.js'
      }
    ]

    it.each([...controllers])(
      "returns controller name for '$path' legacy path",
      ({ name, path }) => {
        expect(controllerNameFromPath(path)).toEqual(name)
      }
    )
  })
})
