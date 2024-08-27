import { type FormDefinition, type Item } from '@defra/forms-model'
import { type ChangeEvent } from 'react'

import { type FormItem } from '~/src/reducers/listReducer.jsx'

export interface ListItemHook {
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleConditionChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleHintChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  prepareForDelete: (data: FormDefinition, index?: number) => FormDefinition
  prepareForSubmit: (data: FormDefinition) => FormDefinition
  validate: (payload: Partial<FormItem>) => boolean
  value?: Item['value']
  condition?: string
  title: string
  hint: string
}
