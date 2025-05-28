import {
  type Page,
  type PageFileUpload,
  type PageQuestion
} from '~/src/form/form-definition/types.js'
import { ComponentType, ControllerType } from '~/src/index.js'
import { ControllerTypes } from '~/src/pages/controller-types.js'
import {
  canSetRepeater,
  controllerNameFromPath,
  getPageDefaults,
  hasComponents,
  hasComponentsEvenIfNoNext,
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
      ControllerType.Start,
      ControllerType.Page,
      ControllerType.Terminal,
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
      ControllerType.Terminal,
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
      ControllerType.Terminal,
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

  describe('hasComponentsEvenIfNoNext', () => {
    const pageWithComponents = {
      components: []
    }

    const pageWithoutComponents = {}

    it('returns true if page has components', () =>
      expect(hasComponentsEvenIfNoNext(pageWithComponents)).toBe(true))

    it('returns false if page has no components', () =>
      expect(hasComponentsEvenIfNoNext(pageWithoutComponents)).toBe(false))

    it('returns false if page is undefined', () =>
      expect(hasComponentsEvenIfNoNext(undefined)).toBe(false))
  })

  describe('controllerNameFromPath', () => {
    it.each([...ControllerTypes])(
      "returns controller name for '$path' legacy path",
      ({ name, path }) => {
        expect(controllerNameFromPath(path)).toEqual(name)
      }
    )
  })

  describe('canSetRepeater', () => {
    it('should not allow repeater to be set if page is an upload page', () => {
      const page: PageFileUpload = {
        id: '85e5c8da-88f5-4009-a821-7d7de1364318',
        title: '',
        path: '/supporting-evidence',
        components: [
          {
            type: ComponentType.FileUploadField,
            title: 'Supporting Evidenceadfadf',
            name: 'yBpZQO',
            shortDescription: 'Supporting evidence',
            hint: 'Hint text',
            options: {
              required: true,
              accept:
                'application/pdf,application/msword,image/jpeg,application/vnd.ms-excel,text/csv'
            },
            schema: {},
            id: '4189b8a1-1a04-4f74-a7a0-dd23012a0ee0'
          }
        ],
        controller: ControllerType.FileUpload,
        next: []
      }
      expect(canSetRepeater(page)).toBe(false)
    })

    it('should not allow repeater to be set if file upload component exists - defensive', () => {
      const page: Page = {
        id: '85e5c8da-88f5-4009-a821-7d7de1364318',
        title: '',
        path: '/supporting-evidence',
        components: [
          {
            type: ComponentType.FileUploadField,
            title: 'Supporting Evidenceadfadf',
            name: 'yBpZQO',
            shortDescription: 'Supporting evidence',
            hint: 'Hint text',
            options: {
              required: true,
              accept:
                'application/pdf,application/msword,image/jpeg,application/vnd.ms-excel,text/csv'
            },
            schema: {},
            id: '4189b8a1-1a04-4f74-a7a0-dd23012a0ee0'
          }
        ],
        next: []
      }
      expect(canSetRepeater(page)).toBe(false)
    })

    it('should allow repeater to be set on a standard page', () => {
      const page: PageQuestion = {
        title: 'sdsfdf',
        path: '/sdsfdf',
        components: [
          {
            type: ComponentType.CheckboxesField,
            title: 'What is your favourite adventure?',
            name: 'jnUjwa',
            shortDescription: 'Your favourite adventure',
            hint: '',
            list: 'sQlrSm',
            options: {
              required: true
            },
            id: '590c50e0-04a3-4e95-80c9-c21a61a0f557'
          }
        ],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }

      expect(canSetRepeater(page)).toBe(true)
    })
  })
})
