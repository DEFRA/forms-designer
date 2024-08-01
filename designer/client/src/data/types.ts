import { type ConditionalComponentType, type Page } from '@defra/forms-model'

export interface Input {
  name: string
  page: {
    path: Page['path']
    section: Page['section']
  }
  propertyPath: string
  list: string | undefined
  title: string
  type: ConditionalComponentType
}

export type Path = Page['path']
export type Found<T> = [T, number]
