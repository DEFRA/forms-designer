import { type ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import { type DateDirections, type DateUnits } from '~/src/conditions/enums.js'
import {
  type ConditionWrapperV2,
  type Item
} from '~/src/form/form-definition/types.js'

/**
 * Interface for `FormEditor` Joi schema
 */
export interface FormEditor {
  /**
   * The type of the page
   */
  pageType: string

  /**
   * The type of the question
   */
  questionType: string | undefined

  /**
   * The sub-type of written answer
   */
  writtenAnswerSub: string

  /**
   * The sub-type of date
   */
  dateSub: string

  /**
   * The sub-type of lists
   */
  listSub: string

  /**
   * The name of the question (unique id)
   */
  name: string

  /**
   * The text of the question
   */
  question: string

  /**
   * The hint text of the question
   */
  hintText: string

  /**
   * Denotes if the question is optional
   */
  questionOptional: string

  /**
   * The short description of the question
   */
  shortDescription: string

  /**
   * The value of checkbox to reveal heading and guidance section
   */
  pageHeadingAndGuidance: string

  /**
   * The page heading
   */
  pageHeading: string

  /**
   * The page guidance text
   */
  guidanceText: string

  /**
   * The value of checkbox to reveal repeater section
   */
  repeater: string

  /**
   * The maximum number of repeater items
   */
  minItems: number

  /**
   * The minimum number of repeater items
   */
  maxItems: number

  /**
   * The repeater question set name
   */
  questionSetName: string

  /**
   * The value of radio to reveal declaration text field
   */
  needDeclaration: string

  /**
   * The check answers declaration text
   */
  declarationText: string

  /**
   * The min length a field can have
   */
  minLength: string

  /**
   * The max length a field can have
   */
  maxLength: string

  /**
   * The regex value of a field
   */
  regex: string

  /**
   * The number of rows of a textarea
   */
  rows: string

  /**
   * The classes to be applied to a field
   */
  classes: string

  /**
   * The prefix to be applied to a field
   */
  prefix: string

  /**
   * The suffix to be applied to a field
   */
  suffix: string

  /**
   * The decimal precision of a number field
   */
  precision: string

  /**
   * The lowest number allowed in a field
   */
  min: string

  /**
   * The highest number allowed in a field
   */
  max: string

  /**
   * The maximum days in the future to allow for a date
   */
  maxFuture: string

  /**
   * The maximum days in the past to allow for a date
   */
  maxPast: string

  /**
   * The exact number of files to upload
   */
  exactFiles: string

  /**
   * The minimum number of files to upload
   */
  minFiles: string

  /**
   * The maximum number of files to upload
   */
  maxFiles: string

  /**
   * The type of files for upload
   */
  fileTypes: string[]

  /**
   * The types of document files for upload
   */
  documentTypes: string[]

  /**
   * The types of image files for upload
   */
  imageTypes: string[]

  /**
   * The types of tabular data files for upload
   */
  tabularDataTypes: string[]

  /**
   * The action required from within a sub-section
   */
  enhancedAction: string

  /**
   * Placeholder for inserted section to handle adding/editing radios or checkboxes
   */
  radiosOrCheckboxes: string

  /**
   * The unique id of the radio item
   */
  radioId: string

  /**
   * The display text of the radio item
   */
  radioText?: string

  /**
   * The hint of the radio item
   */
  radioHint?: string

  /**
   * The value of the radio item
   */
  radioValue?: string

  /**
   * The list name to be applied to a field (if applicable)
   */
  list: string

  /**
   * List items in JSON format, such as for radios ro checkboxes
   */
  listItemsData: string

  /**
   * An array of options for autocomplete
   */
  autoCompleteOptions: Item[]

  /**
   * Set to 'true' is Javascript is enabled
   */
  jsEnabled: string

  /**
   * List item id for conditions
   */
  itemId: string

  /**
   * Relative date period for conditions
   */
  period: string

  /**
   * Relative date unit for conditions
   */
  unit: DateUnits

  /**
   * Relative date direction for conditions
   */
  direction: DateDirections

  /**
   * Denotes if page is an Exit Page
   */
  exitPage: boolean

  /**
   * Denotes if the UK address question supports postcode lookup
   */
  usePostcodeLookup: string
}

export type FormEditorInputPage = Pick<
  FormEditor,
  'pageType' | 'questionType' | 'writtenAnswerSub' | 'dateSub' | 'listSub'
>

export type FormEditorInputCheckAnswersSettings = Pick<
  FormEditor,
  'needDeclaration' | 'declarationText'
>

export type FormEditorInputQuestion = Pick<
  FormEditor,
  | 'questionType'
  | 'name'
  | 'question'
  | 'shortDescription'
  | 'hintText'
  | 'questionOptional'
  | 'minLength'
  | 'maxLength'
  | 'regex'
  | 'rows'
  | 'classes'
  | 'prefix'
  | 'suffix'
  | 'precision'
  | 'min'
  | 'max'
  | 'maxFuture'
  | 'maxPast'
  | 'exactFiles'
  | 'minFiles'
  | 'maxFiles'
  | 'fileTypes'
  | 'documentTypes'
  | 'imageTypes'
  | 'tabularDataTypes'
  | 'autoCompleteOptions'
  | 'enhancedAction'
  | 'radioId'
  | 'radioText'
  | 'radioHint'
  | 'radioValue'
  | 'list'
  | 'listItemsData'
  | 'jsEnabled'
  | 'usePostcodeLookup'
>

export type FormEditorInputPageSettings = Pick<
  FormEditor,
  | 'pageHeadingAndGuidance'
  | 'pageHeading'
  | 'guidanceText'
  | 'repeater'
  | 'minItems'
  | 'maxItems'
  | 'questionSetName'
  | 'exitPage'
>

export type FormEditorInputGuidancePage = Pick<
  FormEditor,
  'pageHeading' | 'guidanceText' | 'exitPage'
>

export type FormEditorInputQuestionDetails = Pick<
  FormEditorInputQuestion,
  | 'question'
  | 'hintText'
  | 'shortDescription'
  | 'questionOptional'
  | 'questionType'
  | 'fileTypes'
  | 'documentTypes'
  | 'imageTypes'
  | 'tabularDataTypes'
  | 'autoCompleteOptions'
  | 'enhancedAction'
  | 'radioId'
  | 'radioText'
  | 'radioHint'
  | 'radioValue'
  | 'listItemsData'
  | 'jsEnabled'
>

type ListValue = string | boolean | number

export interface ListItem {
  id?: string
  text?: string
  hint?: {
    text: string
  }
  value?: ListValue
}

export interface ListLabel {
  text: string
  classes: string
}

export interface ListElement extends ListItem {
  readonly id: string
  text: string
  value: ListValue
  label?: ListLabel
}

export interface ReadonlyHint {
  readonly text: string
}

export interface ListItemReadonly extends ListElement {
  readonly text: string
  readonly hint?: ReadonlyHint
  readonly value: ListValue
  readonly label?: ListLabel
}

export interface DateItem {
  name: string
  classes: string
}

export interface ListConflict {
  conflictItem: {
    id: string
    text: string
  }
  originalItem?: {
    id: string
    text: string
  }
  conditionNames: string[]
  linkableItems: {
    id?: string
    text: string
    value: string | number | boolean
  }[]
  closestMatch?: string | number | boolean
}

export interface QuestionSessionState {
  questionType?: ComponentType
  questionDetails?: Partial<ComponentDef>
  editRow?: {
    radioId?: string
    radioText?: string
    radioHint?: string
    radioValue?: ListValue
    expanded?: boolean
  }
  listItems?: ListItem[]
  isReordering?: boolean
  lastMovedId?: string
  lastMoveDirection?: string
  listConflicts?: ListConflict[]
}

export interface ConditionSessionState {
  id?: string
  stateId?: string
  conditionWrapper?: ConditionWrapperV2
}

export interface ConditionDetails {
  pageCondition: string | undefined
  pageConditionDetails: ConditionWrapperV2 | undefined
  pageConditionPresentationString: string | null
}

export interface GovukFieldItem {
  text?: string
  value?: string
  checked?: boolean
  hint?: { text?: string; html?: string; classes?: string }
}

export interface GovukSummaryListRow {
  key?: {
    text?: string
    classes?: string
  }
  value?: {
    text?: string
    html?: string
    classes?: string
  }
}

export interface GovukField {
  id?: string
  name?: string
  idPrefix?: string
  fieldset?: {
    legend?: { text?: string; isPageHeading?: boolean; classes?: string }
  }
  value?: string | boolean | number | string[] | Item[]
  classes?: string
  label?: {
    text?: string
    html?: string
    classes?: string
    isPageHeading?: boolean
  }
  hint?: { text?: string; html?: string; classes?: string }
  items?: GovukFieldItem[]
  rows?: number
  type?: string
  customTemplate?: string
}

export type GovukFieldQuestionOptional = Omit<GovukField, 'name' | 'items'> & {
  name: 'questionOptional'
  items: [
    {
      text?: string
      value?: string
      checked: boolean
    }
  ]
}

export type GovukStringField = Omit<GovukField, 'value'> & { value: string }

export interface FormEditorGovukField {
  question?: GovukField
  hintText?: GovukField
  questionOptional?: GovukField
  shortDescription?: GovukField
  fileTypes?: GovukField
  documentTypes?: GovukField
  imageTypes?: GovukField
  tabularDataTypes?: GovukField
  radiosOrCheckboxes?: GovukField
  autoCompleteOptions?: GovukField
  usePostcodeLookup?: GovukField
  errorMessage?: { text: string }
}

export type FormEditorGovukFieldBase = Omit<
  FormEditorGovukField,
  'errorMessage'
>

export type FormEditorGovukFieldBaseKeys = keyof FormEditorGovukFieldBase

export interface FormEditorCheckbox {
  text?: string
  hint?: {
    text?: string
  }
  value?: string
  divider?: {
    text?: string
    hint?: string
    value?: string
  }
}

export type AdvancedFieldMappingsType = Record<
  ComponentType,
  Record<string, string>
>

export type HTMLElementOrNull = HTMLElement | null

export type HTMLInputElementOrNull = HTMLInputElement | null

export interface ErrorPreviewFieldMappingDef {
  min?: { fieldName: string; placeholder: string }
  max?: { fieldName: string; placeholder: string }
}
