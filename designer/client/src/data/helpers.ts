import {
  type ComponentDef,
  type ContentComponentsDef,
  type InputFieldsComponentsDef,
  type ListComponentsDef
} from '@defra/forms-model'

export const isNotContentType = (
  obj: ComponentDef
): obj is InputFieldsComponentsDef | ListComponentsDef => {
  const contentTypes: ContentComponentsDef['type'][] = [
    'Details',
    'Html',
    'InsetText',
    'List'
  ]
  return !contentTypes.find((type) => type === obj.type)
}
