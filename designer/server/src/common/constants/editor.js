import { ComponentType } from '@defra/forms-model'

export const QuestionTypeDescriptions =
  /** @type {{type: ComponentType, description: string }[]} */ ([
    {
      type: ComponentType.TextField,
      description: 'Short written answer'
    },
    {
      type: ComponentType.MultilineTextField,
      description: 'Long written answer'
    },
    {
      type: ComponentType.NumberField,
      description: 'Numbers only'
    },
    {
      type: ComponentType.DatePartsField,
      description: 'Date: day, month and year'
    },
    {
      type: ComponentType.MonthYearField,
      description: 'Date: month and year only'
    },
    {
      type: ComponentType.UkAddressField,
      description: 'Address'
    },
    {
      type: ComponentType.TelephoneNumberField,
      description: 'Phone'
    },
    {
      type: ComponentType.FileUploadField,
      description: 'Supporting evidence'
    },
    {
      type: ComponentType.EmailAddressField,
      description: 'Email address'
    },
    {
      type: ComponentType.YesNoField,
      description: 'List: yes or no'
    },
    {
      type: ComponentType.CheckboxesField,
      description: 'List: checkboxes'
    },
    {
      type: ComponentType.RadiosField,
      description: 'List: radios'
    },
    {
      type: ComponentType.AutocompleteField,
      description: 'List: autocomplete'
    },
    {
      type: ComponentType.SelectField,
      description: 'List: select'
    }
  ])

export const QuestionBaseSettings = {
  Name: 'name',
  Question: 'question',
  HintText: 'hintText',
  QuestionOptional: 'questionOptional',
  ShortDescription: 'shortDescription',
  FileTypes: 'fileTypes',
  DocumentTypes: 'documentTypes',
  ImageTypes: 'imageTypes',
  TabularDataTypes: 'tabularDataTypes',
  RadiosOrCheckboxes: 'radiosOrCheckboxes',
  AutoCompleteOptions: 'autoCompleteOptions',
  UsePostcodeLookup: 'usePostcodeLookup'
}

/**
 * @readonly
 * @enum {string}
 */
export const QuestionAdvancedSettings =
  /** @type {Record<string, keyof FormEditorGovukField | 'name'>} */ {
    Classes: 'classes',
    Min: 'min',
    Max: 'max',
    ExactFiles: 'exactFiles',
    MinFiles: 'minFiles',
    MaxFiles: 'maxFiles',
    MinLength: 'minLength',
    MaxLength: 'maxLength',
    MaxFuture: 'maxFuture',
    MaxPast: 'maxPast',
    Precision: 'precision',
    Prefix: 'prefix',
    Suffix: 'suffix',
    Regex: 'regex',
    Rows: 'rows'
  }

/**
 * @readonly
 * @enum {string}
 */
export const QuestionEnhancedFields =
  /** @type {Record<string, keyof FormEditorGovukField | 'name'>} */ {
    RadioId: 'radioId',
    RadioText: 'radioText',
    RadioHint: 'radioHint',
    RadioValue: 'radioValue'
  }

/**
 * @readonly
 * @enum {string}
 */
export const Direction = {
  Up: 'up',
  Down: 'down'
}

/**
 * @readonly
 * @enum {string}
 */
export const ListAction = {
  Move: 'move',
  Reorder: 'reorder',
  DoneReordering: 'done-reordering',
  Delete: 'delete',
  Edit: 'edit',
  Cancel: 'cancel'
}

/**
 * @readonly
 * @enum {string}
 */
export const EnhancedAction = {
  AddItem: 'add-item',
  Reorder: 're-order',
  DoneReordering: 'done-reordering',
  SaveItem: 'save-item',
  Up: 'up',
  Down: 'down'
}

/**
 * @import { FormEditorGovukField } from '@defra/forms-model'
 */
