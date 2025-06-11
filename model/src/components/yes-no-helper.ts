import { SchemaVersion, type List } from '~/src/form/form-definition/types.js'

export const yesNoListId = '3167ecb5-61f9-4918-b7d0-6793b56aa814'
export const yesNoListName = '__yesNo'
export const yesNoListYesItemId = '02900d42-83d1-4c72-a719-c4e8228952fa'
export const yesNoListNoItemId = 'f39000eb-c51b-4019-8f82-bbda0423f04d'

export function getYesNoList(schemaVersion: SchemaVersion = SchemaVersion.V2) {
  return {
    id: schemaVersion === SchemaVersion.V1 ? yesNoListName : yesNoListId,
    name: '__yesNo',
    title: 'Yes/No',
    type: 'boolean',
    items: [
      {
        id: yesNoListYesItemId,
        text: 'Yes',
        value: true
      },
      {
        id: yesNoListNoItemId,
        text: 'No',
        value: false
      }
    ]
  } as List
}
