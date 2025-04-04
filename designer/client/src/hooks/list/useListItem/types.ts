import {
  type ConditionData,
  type ConditionWrapper,
  type ConditionsModelData,
  type Item
} from '@defra/forms-model'
import { type Root } from 'joi'
import { type ChangeEvent } from 'react'

import { type FormItem } from '~/src/reducers/listReducer.jsx'

export interface ListItemHook {
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleConditionChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleHintChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  prepareForDelete: () => void
  prepareForSubmit: () => void
  validate: (payload: Partial<FormItem>, schema: Root) => boolean
  value?: Item['value']
  condition?: string
  text?: string
  description?: string
  allowDelete: boolean
  references?: {
    wrapper: ConditionWrapper
    model: ConditionsModelData
    condition: ConditionData
  }[]
}
