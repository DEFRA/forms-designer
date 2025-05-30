import { type ControllerType, type Repeat } from '~/src/index.js'

export interface PatchPageFields {
  title?: string
  path?: string
  controller?: ControllerType | null
  repeat?: Repeat
  condition?: string | null
}

export interface AddComponentQueryOptions {
  prepend?: boolean
}
