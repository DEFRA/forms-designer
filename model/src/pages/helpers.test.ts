import { ControllerTypes } from '~/src/pages/controller-types.js'
import { ControllerType } from '~/src/pages/enums.js'
import {
  controllerNameFromPath,
  getPageDefaults,
  hasComponents,
  hasFormComponents,
  hasNext,
  hasRepeater
} from '~/src/pages/helpers.js'
import { PageTypes } from '~/src/pages/page-types.js'

describe('helpers', () => {
  describe('getPageDefaults', () => {
    it.each([...PageTypes])(
      "returns page defaults for page type '$controller'",
      (page) => {
        const { controller } = page
        expect(getPageDefaults({ controller })).toEqual(page)
      }
    )
  })

  describe('hasComponents', () => {
    const supported = [
      ControllerType.Content,
      ControllerType.Start,
      ControllerType.Page,
      ControllerType.FileUpload,
      ControllerType.Repeat
    ]

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && supported.includes(controller)
      })
    )("returns true for supported page type '$controller'", (page) =>
      expect(hasComponents(page)).toBe(true)
    )

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && !supported.includes(controller)
      })
    )("returns false for unsupported page type '$controller'", (page) =>
      expect(hasComponents(page)).toBe(false)
    )
  })

  describe('hasFormComponents', () => {
    const supported = [
      ControllerType.Page,
      ControllerType.FileUpload,
      ControllerType.Repeat
    ]

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && supported.includes(controller)
      })
    )("returns true for supported page type '$controller'", (page) =>
      expect(hasFormComponents(page)).toBe(true)
    )

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && !supported.includes(controller)
      })
    )("returns false for unsupported page type '$controller'", (page) =>
      expect(hasFormComponents(page)).toBe(false)
    )
  })

  describe('hasNext', () => {
    const supported = [
      ControllerType.Start,
      ControllerType.Page,
      ControllerType.FileUpload,
      ControllerType.Repeat
    ]

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && supported.includes(controller)
      })
    )("returns true for supported page type '$controller'", (page) =>
      expect(hasNext(page)).toBe(true)
    )

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && !supported.includes(controller)
      })
    )("returns false for unsupported page type '$controller'", (page) =>
      expect(hasNext(page)).toBe(false)
    )
  })

  describe('hasRepeater', () => {
    const supported = [ControllerType.Repeat]

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && supported.includes(controller)
      })
    )("returns true for supported page type '$controller'", (page) =>
      expect(hasRepeater(page)).toBe(true)
    )

    it.each(
      PageTypes.filter(({ controller }) => {
        return !!controller && !supported.includes(controller)
      })
    )("returns false for unsupported page type '$controller'", (page) =>
      expect(hasRepeater(page)).toBe(false)
    )
  })

  describe('controllerNameFromPath', () => {
    it.each([...ControllerTypes])(
      "returns controller name for '$path' legacy path",
      ({ name, path }) => {
        expect(controllerNameFromPath(path)).toEqual(name)
      }
    )
  })
})
