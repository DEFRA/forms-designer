import { ComponentType } from '@defra/forms-model'

import {
  buildAutoCompleteComponent,
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
const listName = 'ListName'
const radioList2Id = '366942ab-640b-4d2e-8637-a6c1f1001d9a'
const radioPage2Id = '55c220b1-bfda-48ff-9297-504721be919c'
const radioList2Name = 'RadioList2'
const radioComponent2Id = 'fb612bb3-1442-41c8-b36f-8ab210f9b24c'

const autoCompletePage = buildQuestionPage({
  id: autoCompletePageId,
  title: 'Autocomplete page',
  components: [
    buildAutoCompleteComponent({
      id: componentId,
      list: listName
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
  list: listName,
  type: ComponentType.RadiosField
})
const radioComponent2 = buildRadioComponent({
  id: radioComponent2Id,
  list: radioList2Name
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

const list = buildList({
  id: autoCompleteListId,
  name: listName,
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

const definitionWithNonUniquelyMappedList = buildDefinition({
  pages: [autoCompletePage, radioPage],
  lists: [list]
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
    listName,
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
      listId: autoCompleteListId
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
    pageWithNonUniquelyMappedList: {
      definition: definitionWithNonUniquelyMappedList,
      pageId: radioPageId
    }
  }
}
