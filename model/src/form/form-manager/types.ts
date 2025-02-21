import { type Page } from '~/src/index.js'

export type PatchPageFields = Partial<Pick<Page, 'title' | 'path'>>

export interface AddComponentQueryOptions {
  prepend?: boolean
}
