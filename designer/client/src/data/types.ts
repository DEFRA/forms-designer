import {
  type ConditionRawData,
  type FormDefinition,
  type InputFieldsComponentsDef,
  type ListComponentsDef,
  type Page
} from '@defra/forms-model'

export interface Input {
  name: string
  page: {
    path: Page['path']
    section: Page['section']
  }
  propertyPath: string
  list: string | undefined
  title: string
  type: InputFieldsComponentsDef['type'] | ListComponentsDef['type']
}

export type Path = Page['path']
export type ConditionName = ConditionRawData['name']
export type Found<T> = [T, number]

export type FormDefinitionResult = FormDefinition
export type FoundResult<T> = Found<T>
