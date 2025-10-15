import {
  buildList,
  buildListItem,
  buildRadiosComponent
} from '~/src/__stubs__/components.js'
import {
  QuestionPreviewElements,
  QuestionRendererStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import {
  ListComponentElements,
  ListQuestion,
  listsElementToMap
} from '~/src/form/form-editor/preview/list.js'

describe('list', () => {
  const emptyBaseElements = /** @type {BaseSettings} */ ({
    items: [],
    optional: false,
    question: 'Which quest would you like to pick?',
    hintText: 'Choose one adventure that best suits you.',
    shortDesc: '',
    largeTitle: true,
    content: ''
  })
  const list1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
  const list1 = /** @type {ListElement} */ ({
    id: list1Id,
    text: 'Treasure Hunting',
    value: 'Treasure Hunting',
    label: {
      classes: '',
      text: 'Treasure Hunting'
    }
  })
  const list2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
  const list2 = /** @type {ListElement} */ ({
    id: list2Id,
    text: 'Rescuing the princess',
    value: 'Rescuing the princess',
    label: {
      classes: '',
      text: 'Rescuing the princess'
    }
  })
  const list3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
  const list3 = /** @type {ListElement} */ ({
    id: list3Id,
    text: 'Saving a city',
    value: 'Saving a city',
    label: {
      classes: '',
      text: 'Saving a city'
    }
  })
  const list4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'
  const list4 = {
    id: list4Id,
    text: 'Defeating the baron',
    value: 'Defeating the baron',
    label: {
      classes: '',
      text: 'Defeating the baron'
    }
  }
  const baseElements = /** @type {BaseSettings} */ ({
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
    ],
    optional: false,
    question: 'Which quest would you like to pick?',
    hintText: 'Choose one adventure that best suits you.',
    shortDesc: ''
  })
  const renderer = new QuestionRendererStub(jest.fn())
  const baronListItemId = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'

  /**
   * @type {ListElements}
   */
  let questionElements = new QuestionPreviewElements(baseElements)
  /**
   * @type {ListElements}
   */
  let emptyQuestionElements

  beforeEach(() => {
    questionElements = new QuestionPreviewElements(baseElements)
    emptyQuestionElements = new QuestionPreviewElements(emptyBaseElements)
  })

  const expectedList = [
    {
      id: list1Id,
      text: 'Treasure Hunting',
      value: 'Treasure Hunting',
      label: {
        classes: '',
        text: 'Treasure Hunting'
      }
    },
    {
      id: list2Id,
      text: 'Rescuing the princess',
      value: 'Rescuing the princess',
      label: {
        classes: '',
        text: 'Rescuing the princess'
      }
    },
    {
      id: list3Id,
      text: 'Saving a city',
      value: 'Saving a city',
      label: {
        classes: '',
        text: 'Saving a city'
      }
    },
    {
      id: list4Id,
      text: 'Defeating the baron',
      value: 'Defeating the baron',
      label: {
        classes: '',
        text: 'Defeating the baron'
      }
    }
  ]
  describe('List', () => {
    it('should delete an element', () => {
      const list = new ListQuestion(emptyQuestionElements, renderer)
      list.push(structuredClone(list1))
      expect(list.list).toEqual([list1])
      list.delete(list1Id)
      expect(list.list).toEqual([])
    })

    it('should edit list text', () => {
      const expectedList = [
        {
          ...list2,
          text: 'Rescuing the princess 👸',
          label: { ...list2.label, text: 'Rescuing the princess 👸' }
        }
      ]
      const list = new ListQuestion(emptyQuestionElements, renderer)
      list.push(structuredClone(list2))
      list.updateText(list2Id, 'Rescuing the princess 👸')
      expect(list.list).toEqual(expectedList)
    })

    it('should add an element', () => {
      const list = new ListQuestion(emptyQuestionElements, renderer)
      list.push(structuredClone(list1))
      expect(list.list).toEqual([list1])
    })

    it('should edit list value', () => {
      const list = new ListQuestion(emptyQuestionElements, renderer)
      list.push(structuredClone(list2))
      list.updateValue(list2Id, 'princess-rescuing')
      expect(list.list).toEqual([{ ...list2, value: 'princess-rescuing' }])
    })

    it('should edit hint', () => {
      const expectedHint = 'When you want to rescue a princess'
      const list = new ListQuestion(emptyQuestionElements, renderer)
      list.push(structuredClone(list2))
      list.updateHint(list2Id, expectedHint)
      expect(list.list).toEqual([
        {
          ...list2,
          hint: {
            classes: '',
            text: 'When you want to rescue a princess'
          }
        }
      ])
    })

    it('should return the correct model', () => {
      const list = new ListQuestion(emptyQuestionElements, renderer)
      const expectedModel = {
        id: 'listInput',
        name: 'listInputField',
        classes: '',
        fieldset: {
          legend: {
            text: 'Which quest would you like to pick?',
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true
          }
        },
        hint: {
          classes: '',
          text: 'Choose one adventure that best suits you.'
        },
        items: expectedList
      }
      list.push(structuredClone(list1))
      list.push(structuredClone(list2))
      list.push(structuredClone(list3))
      list.push(structuredClone(list4))
      expect(list.renderInput).toEqual(expectedModel)
      expect(renderer.renderMock).toHaveBeenCalledWith(
        'preview-components/radios.njk',
        expectedModel
      )
    })

    it('should return the correct model with question highlighted', () => {
      const list = new ListQuestion(emptyQuestionElements, renderer)
      const expectedModel = {
        id: 'listInput',
        name: 'listInputField',
        classes: 'highlight',
        fieldset: {
          legend: {
            text: 'Which quest would you like to pick?',
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true
          }
        },
        hint: {
          classes: '',
          text: 'Choose one adventure that best suits you.'
        },
        items: expectedList
      }
      list.push(list1)
      list.push(list2)
      list.push(list3)
      list.push(list4)
      list.highlightContent()
      expect(list.renderInput).toEqual(expectedModel)
    })

    it('should highlight', () => {
      const preview = new ListQuestion(questionElements, renderer)
      preview.highlight = `${baronListItemId}-hint`
      expect(preview.list[3]).toMatchObject({
        hint: { text: 'Hint text' }
      })
    })

    it('should handle edge cases', () => {
      const preview = new ListQuestion(questionElements, renderer)
      expect(preview.list).toEqual(expectedList)
      preview.updateValue(undefined, 'new-value')
      preview.updateValue('b40e1a4f-9777-463a-a657-83f9da39e69e', 'New Text')
      preview.updateHint(undefined, 'New Hint')
      preview.updateHint('b40e1a4f-9777-463a-a657-83f9da39e69e', 'New Hint')
      preview.updateText(undefined, 'New Text')
      preview.updateText('b40e1a4f-9777-463a-a657-83f9da39e69e', 'New Text')
      expect(preview.list).toEqual(expectedList)
      preview.updateText(baronListItemId, '')
      expect(preview.list[3].text).toBe('Item text')
      expect(listsElementToMap(undefined)).toEqual(new Map([]))
    })
  })

  describe('ListComponentElements', () => {
    it('should map a component base to ListComponentElements', () => {
      const listId = '09a829e5-7f75-4a19-a98a-28f7033faafd'
      const radiosComponent = buildRadiosComponent({
        title: 'Form field title',
        hint: 'Hint text',
        name: 'FFT',
        options: {
          required: true
        },
        shortDescription: 'shortDesc',
        list: listId
      })
      const listId1 = '5eb1938e-ea77-48b3-9668-ff7ecf85d698'
      const listId2 = '7c53794d-cca0-49e2-9290-507720edad96'
      const listId3 = '9fcd3ad3-01b2-48a2-bbd1-0f1be957048c'

      const list = buildList({
        id: listId,
        items: [
          buildListItem({
            id: listId1,
            text: 'England',
            value: 'en',
            hint: {
              text: 'hint'
            }
          }),
          buildListItem({
            id: listId2,
            text: 'France',
            value: 'fr'
          }),
          buildListItem({
            id: listId3,
            text: 'Germany',
            value: 'de'
          })
        ]
      })
      expect(new ListComponentElements(radiosComponent, list).values).toEqual({
        question: 'Form field title',
        hintText: 'Hint text',
        optional: false,
        content: '',
        shortDesc: 'shortDesc',
        items: [
          {
            id: listId1,
            text: 'England',
            label: { text: 'England', classes: '' },
            value: 'en',
            hint: {
              text: 'hint'
            }
          },
          {
            id: listId2,
            text: 'France',
            label: { text: 'France', classes: '' },
            value: 'fr'
          },
          {
            id: listId3,
            text: 'Germany',
            label: { text: 'Germany', classes: '' },
            value: 'de'
          }
        ]
      })
    })
  })
})

/**
 * @import {ListElement} from '~/src/form/form-editor/types.js'
 * @import { HTMLBuilder, ListElements, BaseSettings } from '~/src/form/form-editor/preview/types.js'
 */
