import { type PageRepeat } from '~/src/index.js'

export type PatchPageFields = Partial<
  Pick<PageRepeat, 'title' | 'path' | 'controller' | 'repeat'>
>

export interface AddComponentQueryOptions {
  prepend?: boolean
}
