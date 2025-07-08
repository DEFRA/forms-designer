import { Question } from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionRenderer}
 */
export class QuestionRendererStub {
  /**
   * @type {jest.Mock<void, [string, QuestionBaseModel]>}
   */
  renderMock

  /**
   * @param {jest.Mock<void, [string, QuestionBaseModel]>} renderMock
   */
  constructor(renderMock) {
    this.renderMock = renderMock
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   */
  render(questionTemplate, questionBaseModel) {
    this.renderMock(questionTemplate, questionBaseModel)
  }

  /**
   * @returns {string}
   * @param {string} _questionTemplate
   * @param {RenderContext} _renderContext
   */
  static buildHTML(_questionTemplate, _renderContext) {
    return '**** BUILT HTML ****'
  }
}

/**
 * @implements {PageRenderer}
 */
export class PageRendererStub {
  /**
   * @type {jest.Mock<void, [string, PagePreviewPanelMacro]>}
   */
  renderMock

  /**
   * @param {jest.Mock<void, [string, PagePreviewPanelMacro]>} renderMock
   */
  constructor(renderMock) {
    this.renderMock = renderMock
  }

  /**
   * @param {string} pageTemplate
   * @param {PagePreviewPanelMacro} pagePreviewPanelMacro
   */
  render(pageTemplate, pagePreviewPanelMacro) {
    this.renderMock(pageTemplate, pagePreviewPanelMacro)
  }

  /**
   * @returns {string}
   * @param {string} _questionTemplate
   * @param {RenderContext} _renderContext
   */
  static buildHTML(_questionTemplate, _renderContext) {
    return '**** BUILT HTML ****'
  }
}

/**
 * @implements {ListElements}
 */
export class QuestionPreviewElements {
  /**
   * @protected
   */
  _question = ''
  /** @protected */
  _hintText = ''
  /** @protected */
  _optional = false
  /**
   * @type {string}
   * @protected
   */
  _shortDesc = ''
  /**
   * @type {string}
   * @protected
   */
  _content = ''
  /**
   *
   * @type {ListElement[]}
   * @private
   */
  _items = []
  afterInputsHTML = '<div class="govuk-inset-text">No items added yet.</div>'

  /**
   * @param {BaseSettings} baseSettings
   */
  constructor({ question, hintText, optional, shortDesc, items, content }) {
    this._question = question
    this._hintText = hintText
    this._optional = optional
    this._shortDesc = shortDesc
    this._items = items
    this._content = content
  }

  /**
   * @returns {BaseSettings}
   */
  get values() {
    return {
      question: this._question,
      hintText: this._hintText,
      optional: this._optional,
      shortDesc: this._shortDesc,
      items: this._items,
      content: this._content
    }
  }

  /**
   * @param {string} _value
   */
  setPreviewHTML(_value) {
    // Not implemented for server side render
  }

  /**
   * @param {HTMLElement} _value
   */
  setPreviewDOM(_value) {
    // Not implemented for server side render
  }
}

/**
 * @implements {AutocompleteElements}
 */
export class AutocompletePreviewElements extends QuestionPreviewElements {
  /**
   * @param {BaseSettings & {autocompleteOptions: string}} elements
   */
  constructor({ autocompleteOptions, ...elements }) {
    super(elements)
    this.autocompleteOptions = autocompleteOptions
  }
}

/**
 * @implements {PageOverviewElements}
 */
export class PagePreviewElements {
  guidance
  heading
  addHeading
  repeatQuestion
  hasRepeater

  /**
   * @param {string} heading
   * @param {string} guidance
   * @param {boolean} [addHeading]
   */
  constructor(
    heading,
    guidance = '',
    addHeading = undefined,
    repeatQuestion = '',
    hasRepeater = false
  ) {
    this.heading = heading
    this.guidance = guidance
    this.addHeading = addHeading ?? heading.length > 0
    this.repeatQuestion = repeatQuestion
    this.hasRepeater = hasRepeater
  }
}

export const baseElements = /** @type {BaseSettings} */ ({
  items: [],
  optional: false,
  question: 'Which quest would you like to pick?',
  hintText: 'Choose one adventure that best suits you.',
  shortDesc: '',
  content: '',
  largeTitle: true
})

const list1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
const list2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
const list3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
const list4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'

const listElementsBase = /** @type {BaseSettings} */ ({
  ...baseElements,
  items: [
    {
      label: { text: 'Treasure Hunting' },
      text: 'Treasure Hunting',
      value: 'Treasure Hunting',
      id: list1Id
    },
    {
      label: { text: 'Rescuing the princess' },
      text: 'Rescuing the princess',
      value: 'Rescuing the princess',
      id: list2Id
    },
    {
      label: { text: 'Saving a city' },
      text: 'Saving a city',
      value: 'Saving a city',
      id: list3Id
    },
    {
      label: { text: 'Defeating the baron' },
      text: 'Defeating the baron',
      value: 'Defeating the baron',
      id: list4Id
    }
  ]
})

export const listElementsStub = {
  list1Id,
  list2Id,
  list3Id,
  list4Id,
  baseElements: listElementsBase
}

/**
 * @param {Partial<BaseSettings>} partialBaseElements
 * @param {jest.Mock<void, [string, QuestionBaseModel]>} renderMock
 * @returns {Question}
 */
export function buildPreviewShortAnswer(partialBaseElements, renderMock) {
  return new Question(
    new QuestionPreviewElements({
      ...baseElements,
      ...partialBaseElements
    }),
    new QuestionRendererStub(renderMock)
  )
}

/**
 * @import { ListElement } from  '~/src/form/form-editor/types.js'
 * @import { PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 * @import { BaseSettings, ListElements, RenderContext, QuestionBaseModel, QuestionElements, QuestionRenderer, AutocompleteElements, PageOverviewElements, PageRenderer } from  '~/src/form/form-editor/preview/types.js'
 */
