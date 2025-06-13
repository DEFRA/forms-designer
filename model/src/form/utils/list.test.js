import { buildList, buildRadiosComponent } from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage } from '~/src/__stubs__/pages.js'
import { findDefinitionListFromComponent } from '~/src/form/utils/list.js'

describe('getListFromDefintion', () => {
  const listId = '94fb2a33-d633-440d-94e3-5ac0114ea5a3'
  const listComponent = buildRadiosComponent({
    list: listId
  })
  const list = buildList({
    id: listId,
    title: 'Found list'
  })
  const list2 = buildList({
    id: 'a80e25e5-b9a7-4f67-a8a2-6f3f51d423df',
    title: 'Orphan list'
  })
  const definition = buildDefinition({
    pages: [
      buildQuestionPage({
        components: [listComponent]
      })
    ],
    lists: [list, list2]
  })

  it('should get the list if one exists', () => {
    const foundList = findDefinitionListFromComponent(listComponent, definition)
    expect(foundList.title).toBe('Found list')
  })

  it('should throw if the list does not exist', () => {
    expect(() =>
      findDefinitionListFromComponent(buildRadiosComponent(), definition)
    ).toThrow('List not found')
  })
})
