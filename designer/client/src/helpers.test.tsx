import { controllerNameFromPath, isEmpty } from '~/src/helpers.js'

describe('helpers', () => {
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
