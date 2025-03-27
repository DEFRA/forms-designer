import { type Page } from '~/src/index.js'

export type PatchPageFields = Partial<
  Pick<Page, 'title' | 'path' | 'controller'>
>

export interface AddComponentQueryOptions {
  prepend?: boolean
}
