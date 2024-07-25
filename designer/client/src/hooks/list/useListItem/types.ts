import { type FormDefinition } from '@defra/forms-model'
import { type ChangeEvent } from 'react'

export interface ListItemHook {
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleConditionChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleHintChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  prepareForDelete: <T>(data: T, index?: number) => T
  prepareForSubmit: (data: FormDefinition) => FormDefinition
  validate: (i18n: any) => boolean
  value: any
  condition: any
  title: string
  hint: string
}
