import njk from '~/src/javascripts/preview/nunjucks.js'

interface BaseSettings {
  question: string
  hintText: string
  optional: boolean
  shortDesc: string
}

const defaultBaseSettings: BaseSettings = {
  hintText: '',
  optional: false,
  question: '',
  shortDesc: ''
}

interface HTMLElements {
  question: HTMLInputElement | null
  hintText: HTMLInputElement | null
  optional: HTMLElement | null
  shortDesc: HTMLInputElement | null
}

export class Question {
  public question: string
  public hintText: string
  public optional: boolean
  public readonly baseElements: HTMLElements
  public highlight: string | undefined

  constructor(
    htmlElements: HTMLElements,
    baseSettings: BaseSettings = defaultBaseSettings
  ) {
    this.question = baseSettings.question
    this.hintText = baseSettings.hintText
    this.optional = baseSettings.optional
    this.baseElements = htmlElements
    this.setupListeners()
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
        this.render()
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
            this.highlight = highlight
          },
          'focus'
        ],
        [
          element,
          () => {
            this.highlight = undefined
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
          this.question = target.value
        }
      ],
      [
        this.baseElements.hintText,
        (target: HTMLInputElement) => {
          this.hintText = target.value
        }
      ],
      [
        this.baseElements.optional,
        (target: HTMLInputElement) => {
          this.optional = target.checked
        },
        'change'
      ],
      ...this.highlightListeners
    ]
  }

  protected setupListeners() {
    for (const listener of this.listeners) {
      this.inputEventListener(...listener)
    }
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

    const elements: HTMLElements = {
      question: questionEl,
      hintText: hintTextEl,
      optional: optionalEl,
      shortDesc: shortDescEl
    }

    const question = new Question(elements, {
      hintText: hintTextEl?.value ?? '',
      optional: optionalEl?.checked ?? false,
      question: questionEl?.value ?? '',
      shortDesc: shortDescEl?.value ?? ''
    })
    question.render()
  }
}
