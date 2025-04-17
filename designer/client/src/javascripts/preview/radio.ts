import { dirname, join } from 'node:path'

import nunjucks from 'nunjucks'
import resolvePkg from 'resolve'

import config from '../../../../server/src/config'

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
  question: HTMLElement | null
  hintText: HTMLElement | null
  optional: HTMLElement | null
  shortDesc: HTMLElement | null
}

export const clientEnv = nunjucks.configure(
  [
    join(config.appDir, 'views'),
    join(config.appDir, 'common/templates'),
    join(config.appDir, 'common/components'),
    join(dirname(resolvePkg.sync('govuk-frontend/package.json')), 'dist')
  ],
  {
    trimBlocks: true,
    lstripBlocks: true,
    watch: config.isDevelopment,
    noCache: config.isDevelopment
  }
)

export class Question {
  private _question: string
  private _hintText: string
  private _optional: boolean
  private _shortDesc: string
  private baseElements: HTMLElements

  constructor(
    htmlElements: HTMLElements,
    baseSettings: BaseSettings = defaultBaseSettings
  ) {
    this._question = baseSettings.question
    this._hintText = baseSettings.hintText
    this._optional = baseSettings.optional
    this._shortDesc = baseSettings.shortDesc
    this.baseElements = htmlElements
    this.setupListeners()
  }

  protected setupListeners() {
    this.baseElements.question?.addEventListener('input', (e) => {
      this._question = e.target.value

      this.render()
    })
  }

  protected _render() {
    const html = nunjucks.renderString(
      '<h1>Here is an example: {{ title }}</h1>',
      {
        title: this._question
      }
    )
    const previewBlock = document.getElementById('preview-block')

    if (previewBlock) {
      previewBlock.innerHTML = html
    }
  }

  render() {
    this._render()
  }
}

export class Radio extends Question {}

export function setupPreview() {
  const questionEl = document.getElementById('question')
  const hintTextEl = document.getElementById('hintText')
  const optionalEl = document.getElementById('questionOptional')
  const shortDescEl = document.getElementById('shortDescription')

  const elements: HTMLElements = {
    question: questionEl,
    hintText: hintTextEl,
    optional: optionalEl,
    shortDesc: shortDescEl
  }

  const question = new Question(elements, {
    hintText: hintTextEl?.value ?? '',
    optional: false,
    question: questionEl?.value ?? '',
    shortDesc: shortDescEl?.value ?? ''
  })
  question.render()
}
