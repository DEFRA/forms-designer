import {
  buildCheckboxComponent,
  buildMarkdownComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import {
  buildFileUploadPage,
  buildQuestionPage,
  buildRepeaterPage
} from '~/src/__stubs__/pages.js'
import {
  type Page,
  type PageFileUpload,
  type PageQuestion,
  type PageSummary
} from '~/src/form/form-definition/types.js'
import { ComponentType, ControllerType } from '~/src/index.js'
import { ControllerTypes } from '~/src/pages/controller-types.js'
import {
  controllerNameFromPath,
  getPageDefaults,
  getPageTitle,
  hasComponents,
  hasComponentsEvenIfNoNext,
  hasFormComponents,
  hasNext,
  hasRepeater,
  omitFileUploadComponent,
  showRepeaterSettings
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

  describe('showRepeaterSettings', () => {
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
      expect(showRepeaterSettings(page)).toBe(false)
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
      expect(showRepeaterSettings(page)).toBe(false)
    })

    it('should allow repeater to be set on a standard page', () => {
      const page = buildQuestionPage({
        title: 'sdsfdf',
        path: '/sdsfdf',
        components: [
          buildCheckboxComponent({
            type: ComponentType.CheckboxesField,
            title: 'What is your favourite adventure?',
            name: 'jnUjwa',
            shortDescription: 'Your favourite adventure'
          })
        ],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      })

      expect(showRepeaterSettings(page)).toBe(true)
    })

    it('should allow repeater to be set on a standard page with PageController type', () => {
      const page = buildQuestionPage({
        controller: ControllerType.Page,
        title: 'sdsfdf',
        path: '/sdsfdf',
        components: [
          buildCheckboxComponent({
            type: ComponentType.CheckboxesField,
            title: 'What is your favourite adventure?',
            name: 'jnUjwa',
            shortDescription: 'Your favourite adventure'
          })
        ],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      })

      expect(showRepeaterSettings(page)).toBe(true)
    })

    it('should allow repeater to be set on a Repeater page', () => {
      const page = buildRepeaterPage({
        title: 'sdsfdf',
        path: '/sdsfdf',
        components: [
          buildCheckboxComponent({
            type: ComponentType.CheckboxesField,
            title: 'What is your favourite adventure?',
            name: 'jnUjwa',
            shortDescription: 'Your favourite adventure'
          })
        ],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      })

      expect(showRepeaterSettings(page)).toBe(true)
    })
  })

  describe('omitFileUploadComponent', () => {
    it('should return true if page is a repeater page', () => {
      const page = buildRepeaterPage()
      expect(omitFileUploadComponent(page)).toBe(true)
    })
    it('should return true if a file upload component already exists', () => {
      const page = buildFileUploadPage()
      expect(omitFileUploadComponent(page)).toBe(true)
    })
    it('should return true if more than one components exist', () => {
      const page: PageQuestion = buildQuestionPage({
        title: 'Empty page',
        path: '/empty-page',
        components: [
          buildTextFieldComponent({
            id: 'ee83413e-31b6-4158-98e0-4611479582ce',
            title: 'Simple text field',
            name: 'IHAIzC',
            shortDescription: 'Your simple text field'
          }),
          buildTextFieldComponent({
            type: ComponentType.TextField,
            title: 'Simple text field 2',
            name: 'IHAIzD',
            shortDescription: 'Your simple text field',
            hint: '',
            options: {},
            schema: {},
            id: 'c02ba468-61a3-43f8-bd6a-768bf906d402'
          })
        ]
      })
      expect(omitFileUploadComponent(page)).toBe(true)
    })
    it('should return false no components exist', () => {
      const page: PageQuestion = {
        title: 'Empty page',
        path: '/empty-page',
        components: [],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }
      expect(omitFileUploadComponent(page)).toBe(false)
    })
    it('should return true if page is undefined', () => {
      expect(omitFileUploadComponent(undefined)).toBe(false)
    })
  })

  describe('getPageTitle', () => {
    const components = /** @type {ComponentDef[]} */ [
      buildTextFieldComponent({
        id: 'comp1',
        name: 'comp1',
        title: 'My first component'
      }),
      buildTextFieldComponent({
        id: 'comp2',
        name: 'comp2',
        title: 'My second component'
      })
    ]

    const componentsWithGuidance = /** @type {ComponentDef[]} */ [
      buildMarkdownComponent(),
      buildTextFieldComponent({
        id: 'comp1',
        name: 'comp1',
        title: 'My first component'
      }),
      buildTextFieldComponent({
        id: 'comp2',
        name: 'comp2',
        title: 'My second component'
      })
    ]
    it('should return page title if set on page', () => {
      const page: PageQuestion = {
        title: 'My page title',
        path: '/empty-page',
        components,
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }
      expect(getPageTitle(page)).toBe('My page title')
    })

    it('should return page title from first component if not set on page', () => {
      const page: PageQuestion = {
        title: '',
        path: '/empty-page',
        components,
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }
      expect(getPageTitle(page)).toBe('My first component')
    })

    it('should return page title from first non-markdown component if not set on page', () => {
      const page: PageQuestion = {
        title: '',
        path: '/empty-page',
        components: componentsWithGuidance,
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }
      expect(getPageTitle(page)).toBe('My first component')
    })

    it('should return unknown title if no components and no page title set', () => {
      const page: PageQuestion = {
        title: '',
        path: '/empty-page',
        components: [],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }
      expect(getPageTitle(page)).toBe('Page title unknown')
    })

    it('should return unknown title if components missing and no page title set', () => {
      const page: PageSummary = {
        title: '',
        path: '/empty-page',
        id: '0f711e08-3801-444d-8e37-a88867c48f04',
        controller: ControllerType.Summary
      }
      expect(getPageTitle(page)).toBe('Page title unknown')
    })

    it('should return unknown title if no non-guidance component and no page title set', () => {
      const page: PageQuestion = {
        title: '',
        path: '/empty-page',
        components: [buildMarkdownComponent()],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      }
      expect(getPageTitle(page)).toBe('Page title unknown')
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 */
