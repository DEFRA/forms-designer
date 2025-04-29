import njk from '~/src/javascripts/preview/nunjucks.js'

interface BaseSettings {
  question: string
  hintText: string
  optional: boolean
  shortDesc: string
}

export class QuestionElements {
  question: HTMLInputElement | null
  hintText: HTMLInputElement | null
  optional: HTMLInputElement | null
  shortDesc: HTMLInputElement | null
  preview: HTMLElement | null

  constructor() {
    const questionEl = document.getElementById(
      'question'
    ) as HTMLInputElement | null
    const hintTextEl = document.getElementById(
      'hintText'
    ) as HTMLInputElement | null
    const optionalEl = document.getElementById(
      'questionOptional'
    ) as HTMLInputElement | null
    const shortDescEl = document.getElementById(
      'shortDescription'
    ) as HTMLInputElement | null
    const previewEl = document.getElementById('question-preview-content')

    this.question = questionEl
    this.hintText = hintTextEl
    this.optional = optionalEl
    this.shortDesc = shortDescEl
    this.preview = previewEl
  }

  get values(): BaseSettings {
    return {
      hintText: this.hintText?.value ?? '',
      optional: this.optional?.checked ?? false,
      question: this.question?.value ?? '',
      shortDesc: this.shortDesc?.value ?? ''
    }
  }

  setPreviewHTML(value: string) {
    if (this.preview) {
      this.preview.innerHTML = value
    }
  }
}

type ListenerRow = [
  HTMLInputElement | null,
  (target: HTMLInputElement) => void,
  keyof HTMLElementEventMap
]

export class EventListeners {
  public readonly baseElements: QuestionElements
  private readonly _question: Question

  /**
   * @param {Question} question
   * @param {QuestionElements} baseElements
   */
  constructor(question: Question, baseElements: QuestionElements) {
    this._question = question
    this.baseElements = baseElements
  }

  /**
   * @param {HTMLElement | null} element
   * @param {(inputElement: HTMLInputElement) => void} cb
   * @param {keyof HTMLElementEventMap} type
   * @protected
   */
  protected inputEventListener(
    element: HTMLElement | null,
    cb: (inputElement: HTMLInputElement) => void,
    type: keyof HTMLElementEventMap = 'input'
  ) {
    if (element) {
      element.addEventListener(type, (e) => {
        const target = e.target as HTMLInputElement
        cb(target)
      })
    }
  }

  /**
   * @private
   * @returns {ListenerRow[]}
   */
  private get highlightListeners(): ListenerRow[] {
    const allItems: [HTMLInputElement | null, string][] = [
      [this.baseElements.question, 'question'],
      [this.baseElements.hintText, 'hintText']
    ]

    return allItems.flatMap(([element, highlight]) => {
      const elements: ListenerRow[] = [
        [
          element,
          (_target: HTMLInputElement) => {
            this._question.highlight = highlight
          },
          'focus'
        ],
        [
          element,
          (_target: HTMLInputElement) => {
            this._question.highlight = undefined
          },
          'blur'
        ]
      ]

      return elements
    })
  }

  /**
   * @private
   * @returns {ListenerRow[]}
   */
  private get listeners(): ListenerRow[] {
    const row1: ListenerRow = [
      this.baseElements.question,
      (target: HTMLInputElement) => {
        this._question.question = target.value
      },
      'input'
    ]

    const row2: ListenerRow = [
      this.baseElements.hintText,
      (target: HTMLInputElement) => {
        this._question.hintText = target.value
      },
      'input'
    ]

    const row3: ListenerRow = [
      this.baseElements.optional,
      (target: HTMLInputElement) => {
        this._question.optional = target.checked
      },
      'change'
    ]
    return [row1, row2, row3, ...this.highlightListeners]
  }

  setupListeners() {
    for (const [el, cb, type] of this.listeners) {
      this.inputEventListener(el, cb, type)
    }
  }
}

export interface DefaultComponent {
  id?: string
  text: string
  classes: string
}

export interface FieldSet {
  legend: DefaultComponent
}

export interface QuestionBaseModel {
  id: string
  name: string
  label?: DefaultComponent
  hint?: DefaultComponent
  fieldset?: FieldSet
}

export interface TextFieldModel extends QuestionBaseModel {
  label: DefaultComponent
  hint: DefaultComponent
}

export class Question {
  protected _questionTemplate = 'textfield.njk'
  protected _question: string
  protected _hintText: string
  protected _optional: boolean
  protected _highlight: string | undefined
  private readonly _listeners: EventListeners
  protected _htmlElements: QuestionElements

  constructor(htmlElements: QuestionElements) {
    const { question, hintText, optional } = htmlElements.values

    this._htmlElements = htmlElements
    this._question = question
    this._hintText = hintText
    this._optional = optional

    const listeners = new EventListeners(this, htmlElements)
    listeners.setupListeners()
    this._listeners = listeners
  }

  protected getHighlight(element: string): string {
    return this._highlight === element ? ' highlight' : ''
  }

  protected get label(): DefaultComponent {
    const optionalText = this._optional ? ' (optional)' : ''

    return {
      text: this._question + optionalText,
      classes: 'govuk-label--l' + this.getHighlight('question')
    }
  }

  protected get fieldSet(): FieldSet {
    const optionalText = this._optional ? ' (optional)' : ''

    return {
      legend: {
        text: this._question + optionalText,
        classes: 'govuk-fieldset__legend--l' + this.getHighlight('question')
      }
    }
  }

  protected get hint(): DefaultComponent {
    const text =
      this._highlight === 'hintText' && !this._hintText.length
        ? 'Hint text'
        : this._hintText

    return {
      text,
      classes: this.getHighlight('hintText')
    }
  }

  get renderInput(): QuestionBaseModel {
    return {
      id: 'inputField',
      name: 'inputField',
      label: this.label,
      hint: this.hint
    }
  }

  protected _render() {
    const render = (
      njk as {
        render: (
          name: string,
          ctx: {
            model: QuestionBaseModel
          }
        ) => string
      }
    ).render as (
      name: string,
      ctx: {
        model: QuestionBaseModel
      }
    ) => string

    const html = render(this._questionTemplate, {
      model: this.renderInput
    })

    this._htmlElements.setPreviewHTML(html)
  }

  protected render() {
    // debounce?
    this._render()
  }

  get question(): string {
    return this._question
  }

  set question(value: string) {
    this._question = value
    this.render()
  }

  get hintText(): string {
    return this._hintText
  }

  set hintText(value: string) {
    this._hintText = value
    this.render()
  }

  get optional(): boolean {
    return this._optional
  }

  set optional(value: boolean) {
    this._optional = value
    this.render()
  }

  get highlight(): string | undefined {
    return this._highlight
  }

  set highlight(value: string | undefined) {
    this._highlight = value
    this.render()
  }

  static setupPreview() {
    new Question(new QuestionElements()).render()
  }
}
