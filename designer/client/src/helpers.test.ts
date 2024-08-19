import { controllerNameFromPath } from '~/src/helpers.js'

describe('helpers', () => {
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
