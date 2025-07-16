import {
  buildAutoCompleteComponent,
  buildCheckboxComponent,
  buildDateComponent,
  buildEmailAddressFieldComponent,
  buildMarkdownComponent,
  buildMonthYearFieldComponent,
  buildNumberFieldComponent,
  buildRadioComponent,
  buildSelectFieldComponent,
  buildTelephoneNumberFieldComponent,
  buildTextFieldComponent,
  buildUkAddressFieldComponent,
  buildYesNoFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage, buildSummaryPage } from '~/src/__stubs__/pages.js'
import { PageRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import { SummaryPageController } from '~/src/form/form-editor/preview/controller/summary-page-controller.js'

describe('summary page controller', () => {
  const pageRenderMock = jest.fn()
  const renderer = new PageRendererStub(pageRenderMock)

  it('should work without a declaration', () => {
    const elements = /** @type {SummaryPageElements} */ ({
      heading: '',
      declaration: false,
      guidance: ''
    })
    const definition = buildDefinition({
      pages: [
        buildQuestionPage({
          components: [
            buildTextFieldComponent({
              title: 'What is your full name?',
              shortDescription: 'Your full name'
            }),
            buildDateComponent({
              title: 'What is your date of birth',
              shortDescription: 'Your date of birth'
            }),
            buildUkAddressFieldComponent({
              title: 'What is your address?',
              shortDescription: 'Your address'
            }),
            buildEmailAddressFieldComponent({
              title: 'What is your email address?',
              shortDescription: 'Your email address'
            }),
            buildAutoCompleteComponent({
              title: 'What is your native language?',
              shortDescription: 'Your native language'
            }),
            buildSelectFieldComponent({
              title: 'Which country do you live in?',
              shortDescription: 'Your country'
            }),
            buildTelephoneNumberFieldComponent({
              title: 'What is your phone number?',
              shortDescription: 'Your phone number'
            })
          ]
        }),
        buildQuestionPage({
          components: [
            buildRadioComponent({
              title: 'What is your favourite pizza?',
              shortDescription: 'Your favourite pizza'
            }),
            buildNumberFieldComponent({
              title: "How many pizza's would you like to order?",
              shortDescription: 'Number of pizzas'
            }),
            buildCheckboxComponent({
              title: 'Which toppings would you like?',
              shortDescription: 'Your choice of toppings'
            })
          ]
        }),
        buildQuestionPage({
          components: [
            buildMonthYearFieldComponent({
              title: 'Which month would you like your free pizza?',
              shortDescription: 'Free pizza month'
            }),
            buildYesNoFieldComponent({
              title: 'Are you ready for delivery?',
              shortDescription: 'Your delivery confirmation'
            })
          ]
        })
      ]
    })
    const controller = new SummaryPageController(elements, definition, renderer)
    const expectedActions =
      /** @type {(hiddenText: string) => { actions: { items: { href:string, text:string, visuallyHiddenText: string }[]}}} */ (
        (hiddenText) => ({
          actions: {
            items: [
              { href: '#', text: 'Change', visuallyHiddenText: hiddenText }
            ]
          }
        })
      )
    const DEFAULT_TEXT = 'Answer goes here'
    // prettier-ignore
    expect(controller.componentRows).toEqual({
      rows: [
        { key: { text: 'Your full name' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your full name')},
        { key: { text: 'Your date of birth' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your date of birth')},
        { key: { text: 'Your address' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your address')},
        { key: { text: 'Your email address' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your email address')},
        { key: { text: 'Your native language' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your native language')},
        { key: { text: 'Your country' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your country')},
        { key: { text: 'Your phone number' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your phone number')},
        { key: { text: 'Your favourite pizza' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your favourite pizza')},
        { key: { text: 'Number of pizzas' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Number of pizzas')},
        { key: { text: 'Your choice of toppings' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your choice of toppings')},
        { key: { text: 'Free pizza month' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Free pizza month')},
        { key: { text: 'Your delivery confirmation' }, value: { text: DEFAULT_TEXT }, ...expectedActions('Your delivery confirmation') }
      ]
    })

    expect(controller.components).toEqual([])
    expect(controller.pageTitle.text).toBe(
      'Check your answers before sending your form'
    )
    expect(controller.guidanceText).toBe('')
    expect(controller.guidance).toEqual({
      classes: '',
      text: ''
    })
    expect(controller.makeDeclaration).toBe(false)
    expect(controller.buttonText).toBe('Send')
    expect(controller.components).toHaveLength(0)
  })

  it('should work if a declaration has already been entered', () => {
    const elements = /** @type {SummaryPageElements} */ ({
      heading: '',
      declaration: true,
      guidance: 'Markdown text'
    })
    const definition = buildDefinition({
      pages: [
        buildQuestionPage({
          components: [
            buildTextFieldComponent({
              title: 'What is your full name?',
              shortDescription: 'Your full name'
            })
          ]
        }),
        buildSummaryPage({
          components: [
            buildMarkdownComponent({
              content: 'Markdown text'
            })
          ]
        })
      ]
    })
    const controller = new SummaryPageController(elements, definition, renderer)

    expect(controller.guidanceText).toBe('Markdown text')
    expect(controller.guidance).toEqual({
      classes: '',
      text: 'Markdown text'
    })
    expect(controller.components).toHaveLength(1)
    expect(controller.buttonText).toBe('Accept and send')
  })

  it('should update the declaration text', () => {
    const elements = /** @type {SummaryPageElements} */ ({
      heading: '',
      declaration: false,
      guidance: ''
    })
    const definition = buildDefinition({
      pages: [
        buildQuestionPage({
          components: [
            buildTextFieldComponent({
              title: 'What is your full name?',
              shortDescription: 'Your full name'
            })
          ]
        })
      ]
    })
    const controller = new SummaryPageController(elements, definition, renderer)
    expect(controller.components).toHaveLength(0)
    controller.setMakeDeclaration()
    expect(controller.declaration).toEqual({
      classes: '',
      text: ''
    })
    expect(controller.makeDeclaration).toBe(true)
    expect(controller.components).toHaveLength(0)
    expect(controller.declaration).toEqual(controller.guidance)
    controller.highlightDeclaration()
    expect(controller.declaration).toEqual({
      classes: 'highlight',
      text: 'Declaration text'
    })
    expect(controller.components).toHaveLength(1)
    expect(controller.declaration).toEqual(controller.guidance)
    controller.declarationText = 'This is your declaration'
    expect(controller.declaration).toEqual({
      classes: 'highlight',
      text: 'This is your declaration'
    })
    expect(controller.declaration).toEqual(controller.guidance)
    controller.unhighlightDeclaration()
    expect(controller.declaration).toEqual({
      classes: '',
      text: 'This is your declaration'
    })
    expect(controller.components).toHaveLength(1)
    expect(controller.declaration).toEqual(controller.guidance)
    expect(controller.makeDeclaration).toBe(true)
    controller.unsetMakeDeclaration()
    expect(controller.makeDeclaration).toBe(false)
    expect(controller.declaration).toEqual({
      classes: '',
      text: ''
    })
    expect(controller.components).toHaveLength(0)
  })
})

/**
 * @import { SummaryPageElements } from '~/src/form/form-editor/preview/types.js'
 */
