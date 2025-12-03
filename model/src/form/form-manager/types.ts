import { type Context } from 'joi'

import { type Repeat, type Section } from '~/src/form/form-definition/types.js'
import { type ControllerType } from '~/src/pages/enums.js'

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

export type SectionAssignmentItem = Omit<Section, 'name'> & {
  name?: string
  pageIds: string[]
}

// Enum of error types that can be raised through validating the form definition
export enum FormDefinitionErrorType {
  Unique = 'unique', // Unique constraint
  Ref = 'ref', // Referential integrity
  Type = 'type', // General schema type error
  Incompatible = 'incompatible' // Data values/types that are not compatible
}

// Enum for errors that can exist in a form definition
export enum FormDefinitionError {
  UniquePageId = 'unique_page_id',
  UniquePagePath = 'unique_page_path',
  UniquePageComponentId = 'unique_page_component_id',
  UniquePageComponentName = 'unique_page_component_name',
  UniqueSectionId = 'unique_section_id',
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
  IncompatibleConditionComponentType = 'incompatible_condition_component_type',
  IncompatibleQuestionRegex = 'incompatible_question_regex',
  Other = 'other'
}

export interface ErrorMatchValue {
  key: string
  type: FormDefinitionErrorType
}

export type FormDefinitionErrors = Record<FormDefinitionError, ErrorMatchValue>

// The errors that can exist in the form definition
export const formDefinitionErrors: FormDefinitionErrors = {
  [FormDefinitionError.UniquePagePath]: {
    key: 'path',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniquePageId]: {
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniquePageComponentId]: {
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniquePageComponentName]: {
    key: 'name',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueSectionId]: {
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueSectionName]: {
    key: 'name',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueSectionTitle]: {
    key: 'title',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListId]: {
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListTitle]: {
    key: 'title',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListName]: {
    key: 'name',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueConditionDisplayName]: {
    key: 'displayName',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueConditionId]: {
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListItemId]: {
    key: 'id',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListItemText]: {
    key: 'text',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.UniqueListItemValue]: {
    key: 'value',
    type: FormDefinitionErrorType.Unique
  },
  [FormDefinitionError.RefPageCondition]: {
    key: 'condition',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionComponentId]: {
    key: 'componentId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionListId]: {
    key: 'listId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionItemId]: {
    key: 'itemId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefConditionConditionId]: {
    key: 'conditionId',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.RefPageComponentList]: {
    key: 'list',
    type: FormDefinitionErrorType.Ref
  },
  [FormDefinitionError.IncompatibleConditionComponentType]: {
    key: 'componentId',
    type: FormDefinitionErrorType.Incompatible
  },
  [FormDefinitionError.IncompatibleQuestionRegex]: {
    key: 'regex',
    type: FormDefinitionErrorType.Incompatible
  },
  [FormDefinitionError.Other]: {
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

export interface FormDefinitionErrorCauseDetailIncompatible {
  path: FormDefinitionErrorCauseDetailPath
  valueKey?: string
  incompatibleObject: {
    key?: string
    value?: unknown
  }
  reason: string
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
      message: string
      detail: Context | undefined
    }
  | {
      id: FormDefinitionError
      type: FormDefinitionErrorType.Incompatible
      message: string
      detail: FormDefinitionErrorCauseDetailIncompatible
    }
