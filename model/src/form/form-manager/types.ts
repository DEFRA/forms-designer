import { type Context } from 'joi'

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

// Enum of error types that can be raised through validating the form definition
export enum FormDefinitionErrorType {
  Unique = 'unique', // Unique constraint
  Ref = 'ref', // Referential integrity
  Type = 'type' // General schema type error
}

// Enum for errors that can exist in a form definition
export enum FormDefinitionError {
  UniquePagePath = 'unique_page_path',
  UniquePageId = 'unique_page_id',
  UniquePageComponentId = 'unique_page_component_id',
  UniquePageComponentName = 'unique_page_component_name',
  UniqueSectionName = 'unique_section_name',
  UniqueSectionTitle = 'unique_section_title',
  UniqueListId = 'unique_list_id',
  UniqueListTitle = 'unique_list_title',
  UniqueListName = 'unique_list_name',
  UniqueConditionId = 'unique_condition_id',
  UniqueConditionDisplayName = 'unique_condition_displayname',
  UniqueListItemId = 'unique_list_item_id',
  UniqueListItemText = 'unique_list_item_text',
  UniqueListItemValue = 'unique_list_item_value',
  RefPageCondition = 'ref_page_condition',
  RefConditionComponentId = 'ref_condition_component_id',
  RefConditionListId = 'ref_condition_list_id',
  RefConditionItemId = 'ref_condition_item_id',
  RefConditionConditionId = 'ref_condition_condition_id',
  RefPageComponentList = 'ref_page_component_list',
  Other = 'other'
}

export const N = Symbol('AnyNumber')

export type ErrorMatchPath = (string | typeof N)[]
export interface ErrorMatchValue {
  path: ErrorMatchPath
  key: string
  type: FormDefinitionErrorType
}

export type FormDefinitionErrors = Record<FormDefinitionError, ErrorMatchValue>

// The errors that can exist in the form definition
export const formDefinitionErrors: FormDefinitionErrors = {
  [FormDefinitionError.UniquePagePath]: {
    path: ['pages', N],
    key: 'path',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniquePageId]: {
    path: ['pages', N],
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniquePageComponentId]: {
    path: ['pages', N, 'components', N],
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniquePageComponentName]: {
    path: ['pages', N, 'components', N],
    key: 'name',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueSectionName]: {
    path: ['sections', N],
    key: 'name',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueSectionTitle]: {
    path: ['sections', N],
    key: 'title',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListId]: {
    path: ['lists', N],
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListTitle]: {
    path: ['lists', N],
    key: 'title',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListName]: {
    path: ['lists', N],
    key: 'name',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueConditionDisplayName]: {
    path: ['conditions', N],
    key: 'displayName',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueConditionId]: {
    path: ['conditions', N],
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListItemId]: {
    path: ['lists', N, 'items', N],
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListItemText]: {
    path: ['lists', N, 'items', N],
    key: 'text',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListItemValue]: {
    path: ['lists', N, 'items', N],
    key: 'value',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.RefPageCondition]: {
    path: ['pages', N, 'condition'],
    key: 'condition',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionComponentId]: {
    path: ['conditions', N, 'items', N, 'componentId'],
    key: 'componentId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionListId]: {
    path: ['conditions', N, 'items', N, 'value', 'listId'],
    key: 'listId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionItemId]: {
    path: ['conditions', N, 'items', N, 'value', 'itemId'],
    key: 'itemId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionConditionId]: {
    path: ['conditions', N, 'items', N, 'conditionId'],
    key: 'conditionId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefPageComponentList]: {
    path: ['pages', N, 'components', N, 'list'],
    key: 'list',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.Other]: {
    path: [],
    key: '',
    type: FormDefinitionErrorType.Type
  }
}

export type FormDefinitionErrorCauseDetailPath = (string | number)[]

export interface FormDefinitionErrorCauseDetailUnique {
  path: FormDefinitionErrorCauseDetailPath
  pos: number
  dupePos: number
}

export interface FormDefinitionErrorCauseDetailRef {
  path: FormDefinitionErrorCauseDetailPath
}

export type FormDefinitionErrorCause =
  | {
      id: FormDefinitionError
      type: FormDefinitionErrorType.Unique
      message: string
      detail: FormDefinitionErrorCauseDetailUnique
    }
  | {
      id: FormDefinitionError
      type: FormDefinitionErrorType.Ref
      message: string
      detail: FormDefinitionErrorCauseDetailRef
    }
  | {
      id: FormDefinitionError
      type: FormDefinitionErrorType.Type
      message: string /*  */
      detail: Context | undefined
    }
