import { ControllerTypes } from '~/src/pages/controller-types.js'
import { controllerNameFromPath } from '~/src/pages/helpers.js'

describe('helpers', () => {
  describe('controllerNameFromPath', () => {
    it.each([...ControllerTypes])(
      "returns controller name for '$path' legacy path",
      ({ name, path }) => {
        expect(controllerNameFromPath(path)).toEqual(name)
      }
    )
  })
})
