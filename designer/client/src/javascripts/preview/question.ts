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
  optional: HTMLElement | null
  shortDesc: HTMLInputElement | null

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

    this.question = questionEl
    this.hintText = hintTextEl
    this.optional = optionalEl
    this.shortDesc = shortDescEl
  }

  get values(): BaseSettings {
    return {
      hintText: this.hintText?.value ?? '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      optional: this.optional?.checked ?? false,
      question: this.question?.value ?? '',
      shortDesc: this.shortDesc?.value ?? ''
    }
  }
}

export class EventListeners {
  public readonly baseElements: QuestionElements
  private readonly _question: Question

  constructor(question: Question, baseElements: QuestionElements) {
    this._question = question
    this.baseElements = baseElements
  }

  protected inputEventListener(
    element: HTMLElement | null,
    cb: (inputElement: HTMLInputElement) => void,
    type: keyof HTMLElementEventMap = 'input'
  ) {
    if (element) {
      element.addEventListener(type, (e) => {
        const target = e.target as HTMLInputElement
        cb(target)
        this._question.render()
      })
    }
  }

  private get highlightListeners(): [HTMLElement, () => void, string][] {
    const allItems: [HTMLElement | null, string][] = [
      [this.baseElements.question, 'question'],
      [this.baseElements.hintText, 'hintText']
    ]
    const items = allItems.filter(Boolean) as [HTMLElement, string][]

    return items.flatMap(([element, highlight]) => {
      const elements: [HTMLElement, () => void, string][] = [
        [
          element,
          () => {
            this._question.highlight = highlight
          },
          'focus'
        ],
        [
          element,
          () => {
            this._question.highlight = undefined
          },
          'blur'
        ]
      ]

      return elements
    })
  }

  private get listeners() {
    return [
      [
        this.baseElements.question,
        (target: HTMLInputElement) => {
          this._question.question = target.value
        }
      ],
      [
        this.baseElements.hintText,
        (target: HTMLInputElement) => {
          this._question.hintText = target.value
        }
      ],
      [
        this.baseElements.optional,
        (target: HTMLInputElement) => {
          this._question.optional = target.checked
        },
        'change'
      ],
      ...this.highlightListeners
    ]
  }

  setupListeners() {
    for (const listener of this.listeners) {
      this.inputEventListener(...listener)
    }
  }
}

export class Question {
  public question: string
  public hintText: string
  public optional: boolean
  public highlight: string | undefined
  private readonly _listeners: EventListeners

  constructor(htmlElements: QuestionElements) {
    const { question, hintText, optional } = htmlElements.values

    this.question = question
    this.hintText = hintText
    this.optional = optional

    const listeners = new EventListeners(this, htmlElements)
    listeners.setupListeners()
    this._listeners = listeners
  }

  protected getHighlight(element: string): string {
    return this.highlight === element ? ' highlight' : ''
  }

  private get label() {
    const optionalText = this.optional ? ' (optional)' : ''

    return {
      text: this.question + optionalText,
      classes: 'govuk-label--l' + this.getHighlight('question')
    }
  }

  private get hint() {
    const text =
      this.highlight === 'hintText' && !this.hintText.length
        ? 'Hint text'
        : this.hintText

    return {
      text,
      classes: this.getHighlight('hintText')
    }
  }

  get renderInput() {
    return {
      id: 'inputField',
      name: 'inputField',
      label: this.label,
      hint: this.hint
    }
  }

  protected _render() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const render = njk.render as (name, ctx) => string

    const html = render('input.njk', {
      model: this.renderInput
    })
    const previewBlock = document.getElementById('question-preview-content')

    if (previewBlock) {
      previewBlock.innerHTML = html
    }
  }

  render() {
    this._render()
  }

  static setupPreview() {
    const elements = new QuestionElements()
    const question = new Question(elements)
    question.render()
  }
}
