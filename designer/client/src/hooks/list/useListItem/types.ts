import { type FormDefinition } from '@defra/forms-model'
import { type ChangeEvent } from 'react'

import { type FormItem } from '~/src/reducers/listReducer.jsx'

export interface ListItemHook {
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleConditionChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleHintChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  prepareForDelete: <T>(data: T, index?: number) => T
  prepareForSubmit: (data: FormDefinition) => FormDefinition
  validate: (payload: Partial<FormItem>) => boolean
  value: any
  condition: any
  title: string
  hint: string
}
