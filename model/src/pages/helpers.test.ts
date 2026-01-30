import {
  buildCheckboxComponent,
  buildMarkdownComponent,
  buildPaymentComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import {
  buildFileUploadPage,
  buildQuestionPage,
  buildRepeaterPage,
  buildSummaryPage
} from '~/src/__stubs__/pages.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  type Page,
  type PageFileUpload,
  type PageQuestion,
  type PageSummary
} from '~/src/form/form-definition/types.js'
import { ControllerTypes } from '~/src/pages/controller-types.js'
import { ControllerType } from '~/src/pages/enums.js'
import {
  controllerNameFromPath,
  getPageDefaults,
  getPageFromDefinition,
  getPageTitle,
  hasComponents,
  hasComponentsEvenIfNoNext,
  hasFormComponents,
  hasNext,
  hasRepeater,
  isEndPage,
  isPaymentPage,
  isSummaryPage,
  replaceCustomControllers,
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

    it('should not allow repeater on a payment page', () => {
      const page = buildQuestionPage({
        title: 'sdsfdf',
        path: '/sdsfdf',
        components: [buildPaymentComponent()],
        next: [],
        id: '0f711e08-3801-444d-8e37-a88867c48f04'
      })

      expect(showRepeaterSettings(page)).toBe(false)
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

    it('should not allow repeater to be set if all components are declarations - defensive', () => {
      const page: Page = {
        id: '85e5c8da-88f5-4009-a821-7d7de1364318',
        title: '',
        path: '/declarations',
        components: [
          {
            type: ComponentType.Markdown,
            title: 'Guidance',
            name: 'adKHjg',
            content: '# Guidance text',
            options: {}
          },
          {
            type: ComponentType.DeclarationField,
            title: 'Declaration 1',
            name: 'yBpZQO',
            shortDescription: 'Declaration 1',
            content: '# Some markdown',
            options: {
              required: true
            },
            id: '4189b8a1-1a04-4f74-a7a0-dd23012a0ee0'
          },
          {
            type: ComponentType.DeclarationField,
            title: 'Declaration 2',
            name: 'dyHbne',
            shortDescription: 'Declaration 2',
            content: '# Some more markdown',
            options: {
              required: true
            },
            id: '8bab5c2a-7e7e-495d-97a8-3b301ee2906f'
          }
        ],
        next: []
      }
      expect(showRepeaterSettings(page)).toBe(false)
    })

    it('should allow repeater when at least one component is not a declaration', () => {
      const page: Page = {
        id: '85e5c8da-88f5-4009-a821-7d7de1364318',
        title: '',
        path: '/supporting-evidence',
        components: [
          {
            type: ComponentType.Markdown,
            title: 'Guidance',
            name: 'adKHjg',
            content: '# Guidance text',
            options: {}
          },
          {
            type: ComponentType.DeclarationField,
            title: 'Declaration 1',
            name: 'yBpZQO',
            shortDescription: 'Declaration 1',
            content: '# Some markdown',
            options: {
              required: true
            },
            id: '4189b8a1-1a04-4f74-a7a0-dd23012a0ee0'
          },
          {
            type: ComponentType.TextField,
            title: 'Enter your name',
            name: 'dyKLL',
            shortDescription: 'Your name',
            options: {
              required: true
            },
            schema: {},
            id: '8bab5c2a-7e7e-495d-97a8-3b301ee2906f'
          }
        ],
        next: []
      }
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

  describe('getPageFromDefinition', () => {
    const pageId = '7dcf119c-9846-4e0e-a350-6b3730e45016'
    it('should get the page if it exists', () => {
      const page = buildQuestionPage({
        id: pageId
      })
      const definition = buildDefinition({
        pages: [page]
      })
      expect(getPageFromDefinition(definition, pageId)).toEqual(page)
    })

    it('should return undefined if it does not exist', () => {
      const definition = buildDefinition({
        pages: []
      })
      expect(getPageFromDefinition(definition, pageId)).toBeUndefined()
    })
  })

  describe('isSummaryPage', () => {
    it('should return true for SummaryController', () => {
      const page = {
        controller: ControllerType.Summary,
        path: '/summary',
        title: 'Summary'
      } as Page
      expect(isSummaryPage(page)).toBe(true)
    })

    it('should return true for SummaryWithConfirmationEmailController', () => {
      const page = {
        controller: ControllerType.SummaryWithConfirmationEmail,
        path: '/summary',
        title: 'Summary'
      } as Page
      expect(isSummaryPage(page)).toBe(true)
    })

    it('should return false for non-summary controller', () => {
      const page = {
        controller: ControllerType.Page,
        path: '/other',
        title: 'Other'
      } as Page
      expect(isSummaryPage(page)).toBe(false)
    })
  })

  describe('replaceCustomControllers', () => {
    it('should replace custom controllers with PageController', () => {
      const page0 = buildQuestionPage({
        controller: ControllerType.Page
      })
      const page1 = buildFileUploadPage()
      const page2 = buildSummaryPage()
      const page3 = buildQuestionPage({
        // @ts-expect-error - custom controller
        controller: ControllerType.SummaryWithConfirmationEmail
      })
      const page4 = buildQuestionPage({
        // @ts-expect-error - custom controller
        controller: 'FeedbackPageController'
      })
      const page5 = buildQuestionPage({
        // @ts-expect-error - custom controller
        controller: 'OtherCustomPageController'
      })
      const definition = buildDefinition({
        pages: [page0, page1, page2, page3, page4, page5]
      })
      const res = replaceCustomControllers(definition)
      expect(res.pages[0].controller).toBe(ControllerType.Page)
      expect(res.pages[1].controller).toBe(ControllerType.FileUpload)
      expect(res.pages[2].controller).toBe(ControllerType.Summary)
      expect(res.pages[3].controller).toBe(ControllerType.Page)
      expect(res.pages[4].controller).toBe(ControllerType.Page)
      expect(res.pages[5].controller).toBe(ControllerType.Page)
    })
  })

  describe('isPaymentPage', () => {
    it('should return true for a page containing a payment question', () => {
      const page = {
        path: '/page',
        title: 'Example page',
        components: [
          {
            name: 'payment',
            type: ComponentType.PaymentField
          }
        ]
      } as Page
      expect(isPaymentPage(page)).toBe(true)
    })

    it('should return false for a page without a payment question', () => {
      const page = {
        path: '/page',
        title: 'Example page',
        components: [
          {
            name: 'payment',
            type: ComponentType.TextField
          }
        ]
      } as Page
      expect(isPaymentPage(page)).toBe(false)
    })

    it('should return false for a page with no questions', () => {
      // @ts-expect-error - missing components on this page
      const page = {
        path: '/page',
        title: 'Example page',
        components: []
      } as Page
      expect(isPaymentPage(page)).toBe(false)
    })
  })

  describe('isEndPage', () => {
    it('should return true for a page containing a payment question', () => {
      const page = {
        path: '/page',
        title: 'Example page',
        components: [
          {
            name: 'payment',
            type: ComponentType.PaymentField
          }
        ]
      } as Page
      expect(isEndPage(page)).toBe(true)
    })

    it('should return true for a summary page', () => {
      const page = {
        controller: ControllerType.Summary,
        path: '/summary',
        title: 'Summary'
      } as Page
      expect(isEndPage(page)).toBe(true)
    })

    it('should return false for a page that isnt summary or payment', () => {
      const page = {
        path: '/page',
        title: 'Example page',
        components: [
          {
            name: 'text',
            type: ComponentType.TextField
          }
        ]
      } as Page
      expect(isEndPage(page)).toBe(false)
    })
  })
})

/**
 * @import { ComponentDef } from '~/src/components/types.js'
 */
