import { ComponentType } from '@defra/forms-model'

import {
  buildAutoCompleteComponent,
  buildCheckboxComponent,
  buildDefinition,
  buildList,
  buildListItem,
  buildQuestionPage,
  buildRadioComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/form-definition.js'

const autoCompletePageId = '938d0853-7874-4b46-bd7e-3eeb93413f51'
const questionPageId = '938d0853-7874-4b46-bd7e-3eeb93413f51'
const componentId = 'b96fa4e3-a4dc-4e71-a4b5-86db511dec7a'
const autoCompleteListId = '390ed821-8925-4ab8-9b35-9b6e55d5cac5'
const radioPageId = '6282ee22-5474-4701-b517-f8fdf61c1b3e'
const listId = '12795d43-e53d-4886-a212-40808297048f'
const radioList2Id = '366942ab-640b-4d2e-8637-a6c1f1001d9a'
const radioPage2Id = '55c220b1-bfda-48ff-9297-504721be919c'
const radioList2Name = 'RadioList2'
const radioComponent2Id = 'fb612bb3-1442-41c8-b36f-8ab210f9b24c'
const checkboxListName = 'CheckboxList'
const checkBoxListId = '0c427c3d-7502-445b-bd07-bdc8613e74cc'
const checkboxComponentId = 'e40d2b9d-84d6-4ae5-bc80-0cdddd894c8c'
const checkboxPageId = 'f229fb05-6639-4a6c-84aa-4df47d31dc78'
const listIdWithItemIds = 'c3e6bf9a-d667-4f6e-a1f1-f2d07ab32373'

const autoCompletePage = buildQuestionPage({
  id: autoCompletePageId,
  title: 'Autocomplete page',
  components: [
    buildAutoCompleteComponent({
      id: componentId,
      list: listId
    })
  ]
})
const questionPage = buildQuestionPage({
  id: questionPageId,
  title: 'Text Field Question Page',
  components: [
    buildTextFieldComponent({
      id: '394bfc81-1994-4c9c-b734-6742dadb22e0'
    })
  ]
})

const radioComponent = buildRadioComponent({
  id: '3382678a-2f3b-437c-997a-a2586eacb671',
  list: listId,
  type: ComponentType.RadiosField
})
const radioComponent2 = buildRadioComponent({
  id: radioComponent2Id,
  list: radioList2Id
})
const checkboxComponent = buildCheckboxComponent({
  id: checkboxComponentId,
  list: checkBoxListId
})
const radioPage = buildQuestionPage({
  id: radioPageId,
  title: 'Radio page',
  components: [radioComponent]
})
const radioPage2 = buildQuestionPage({
  ...radioPage,
  id: radioPage2Id,
  components: [radioComponent, radioComponent2]
})
const checkboxPage = buildQuestionPage({
  id: checkboxPageId,
  components: [checkboxComponent, radioComponent2]
})

const list = buildList({
  id: listId,
  name: 'listName',
  items: [
    buildListItem({ value: 'england', text: 'England' }),
    buildListItem({ value: 'scotland', text: 'Scotland' }),
    buildListItem({ value: 'wales', text: 'Wales' })
  ]
})
const radioList2 = buildList({
  id: radioList2Id,
  name: radioList2Name
})
const checkboxList = buildList({
  id: checkBoxListId,
  name: checkboxListName,
  items: [
    buildListItem({ value: 'frodo', text: 'Frodo Baggins' }),
    buildListItem({ value: 'samwise', text: 'Samwise Gangi' }),
    buildListItem({ value: 'gandalf', text: 'Gandalf' }),
    buildListItem({ value: 'arwena', text: 'Arwena' }),
    buildListItem({ value: 'aragorn', text: 'Aragorn' }),
    buildListItem({ value: 'gimli', text: 'Gimli' })
  ]
})
const listWithItemIds = buildList({
  id: listIdWithItemIds,
  name: 'listWithItemIds',
  items: [
    buildListItem({ id: 'id1', value: 'england', text: 'England' }),
    buildListItem({ id: 'id2', value: 'scotland', text: 'Scotland' }),
    buildListItem({ id: 'id3', value: 'wales', text: 'Wales' })
  ]
})

const orphanedListDefinition = buildDefinition({
  pages: [autoCompletePage],
  lists: [list]
})
const nonOrphanedListDefinition = buildDefinition({
  pages: [autoCompletePage, radioPage],
  lists: [list]
})
const definitionWithNoLists = buildDefinition({
  pages: [questionPage]
})

const definitionWithUniquelyMappedList = buildDefinition({
  pages: [autoCompletePage, radioPage, radioPage2],
  lists: [list, radioList2]
})

const definitionWithUniquelyMappedLists = buildDefinition({
  pages: [autoCompletePage, radioPage, checkboxPage],
  lists: [list, radioList2, checkboxList]
})

const definitionWithNonUniquelyMappedList = buildDefinition({
  pages: [autoCompletePage, radioPage],
  lists: [list]
})

const definitionWithListItemIds = buildDefinition({
  lists: [listWithItemIds]
})

export function uniquelyMappedListsStubs() {
  return {
    radio: {
      pageId: radioPageId,
      page: radioPage,
      component: radioComponent
    },
    questionPage,
    autoCompletePage,
    listId,
    listWithItemIds,
    basicList: list,
    autoCompletePageId,
    questionPageId,
    componentId,
    autoCompleteListId,
    radioPageId,
    orphanedListOnComponent: {
      definition: orphanedListDefinition,
      pageId: autoCompletePageId,
      componentId,
      listId
    },
    nonOrphanedListOnComponent: {
      definition: nonOrphanedListDefinition,
      pageId: autoCompletePageId,
      componentId
    },
    noListOnPage: {
      definition: definitionWithNoLists,
      pageId: questionPageId,
      componentId
    },
    pageWithUniqueMappedList: {
      definition: definitionWithUniquelyMappedList,
      pageId: radioPage2Id,
      listId: radioList2Id
    },
    pageWithUniquelyMappedLists: {
      definition: definitionWithUniquelyMappedLists,
      pageId: checkboxPageId,
      listIds: [checkBoxListId, radioList2Id]
    },
    pageWithNonUniquelyMappedList: {
      definition: definitionWithNonUniquelyMappedList,
      pageId: radioPageId
    },
    exampleWithListItemIds: {
      definition: definitionWithListItemIds,
      listIdWithItemIds
    }
  }
}
