import {
  getYesNoList,
  yesNoListId,
  yesNoListName
} from '~/src/components/yes-no-helper.js'
import { SchemaVersion } from '~/src/form/form-definition/types.js'

describe('Yes/no helper', () => {
  test('should return yes/no list with no param', () => {
    const list = getYesNoList()

    expect(list.id).toBe(yesNoListId)
    expect(list.items).toHaveLength(2)
    expect(list.items[0].id).toBe('02900d42-83d1-4c72-a719-c4e8228952fa')
    expect(list.items[1].id).toBe('f39000eb-c51b-4019-8f82-bbda0423f04d')
  })

  test('should return yes/no list with V1 param', () => {
    const list = getYesNoList(SchemaVersion.V1)

    expect(list.id).toBe(yesNoListName)
    expect(list.items).toHaveLength(2)
    expect(list.items[0].id).toBe('02900d42-83d1-4c72-a719-c4e8228952fa')
    expect(list.items[1].id).toBe('f39000eb-c51b-4019-8f82-bbda0423f04d')
  })
})
