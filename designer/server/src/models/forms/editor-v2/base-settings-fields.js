import {
  ComponentType,
  allDocumentTypes,
  allImageTypes,
  allTabularDataTypes,
  autoCompleteOptionsSchema,
  questionDetailsFullSchema
} from '@defra/forms-model'
import Joi from 'joi'

import { isLocationFieldType } from '~/src/common/constants/component-types.js'
import { QuestionBaseSettings } from '~/src/common/constants/editor.js'
import {
  getListFromComponent,
  handlePrecision,
  insertValidationErrors,
  mapListToTextareaStr
} from '~/src/lib/utils.js'
import { allBaseSettingsFields } from '~/src/models/forms/editor-v2/base-settings-field-config.js'
import { tickBoxes } from '~/src/models/forms/editor-v2/common.js'
import {
  allowedParentFileTypes,
  getSelectedFileTypesFromCSVMimeTypes
} from '~/src/models/forms/editor-v2/file-type-utils.js'
import {
  getDefaultLocationHint,
  locationHintDefaults
} from '~/src/models/forms/editor-v2/location-hint-defaults.js'

export {
  getSelectedFileTypesFromCSVMimeTypes,
  mapExtensionsToMimeTypes,
  mapPayloadToFileMimeTypes
} from '~/src/models/forms/editor-v2/file-type-utils.js'
export { allBaseSettingsFields } from '~/src/models/forms/editor-v2/base-settings-field-config.js'

const TABULAR_DATA = 'tabular-data'
const DOCUMENTS = 'documents'
const IMAGES = 'images'
const ANY = 'any'
const PAYMENT_RANGE_ERROR_MESSAGE =
  'Enter a valid payment amount between £0.30 and £100,000'

export const baseSchema = Joi.object().keys({
  name: questionDetailsFullSchema.nameSchema,
  question: questionDetailsFullSchema.questionSchema.when('enhancedAction', {
    is: Joi.exist(),
    then: Joi.string().optional().allow(''),
    otherwise: Joi.when('questionType', {
      is: 'PaymentField',
      then: Joi.string().optional().allow(''),
      otherwise: Joi.string().trim().required().messages({
        '*': 'Enter a question'
      })
    })
  }),
  hintText: questionDetailsFullSchema.hintTextSchema,
  declarationText: questionDetailsFullSchema.declarationTextSchema.when(
    'questionType',
    {
      is: 'DeclarationField',
      then: questionDetailsFullSchema.declarationTextSchema
        .required()
        .messages({
          '*': 'Enter declaration text'
        }),
      otherwise: Joi.string().optional().allow('')
    }
  ),
  questionOptional: questionDetailsFullSchema.questionOptionalSchema,
  shortDescription: questionDetailsFullSchema.shortDescriptionSchema.when(
    'enhancedAction',
    {
      is: Joi.exist(),
      then: Joi.string().optional().allow(''),
      otherwise: Joi.when('questionType', {
        is: 'PaymentField',
        then: Joi.string().optional().allow(''),
        otherwise: Joi.string().trim().required().messages({
          '*': 'Enter a short description'
        })
      })
    }
  ),
  questionType: questionDetailsFullSchema.questionTypeFullSchema.messages({
    '*': 'The question type is missing'
  }),
  list: questionDetailsFullSchema.listForQuestionSchema,
  fileTypes: questionDetailsFullSchema.fileTypesSchema
    .when('questionType', {
      is: 'FileUploadField',
      then: Joi.required().messages({
        '*': 'Select the type of file you want to upload'
      })
    })
    .when(Joi.ref('.'), {
      is: Joi.array().has(Joi.string().valid(ANY)),
      then: Joi.array().length(1).messages({
        'array.length':
          'When any file type is allowed, no other file types can be selected'
      })
    }),
  documentTypes: questionDetailsFullSchema.documentTypesSchema.when(
    'questionType',
    {
      is: 'FileUploadField',
      then: Joi.array().when('fileTypes', {
        is: Joi.array().has(DOCUMENTS),
        then: Joi.required().messages({
          '*': 'Choose the document file types you accept'
        })
      })
    }
  ),
  imageTypes: questionDetailsFullSchema.imageTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has(IMAGES),
      then: Joi.required().messages({
        '*': 'Choose the image file types you accept'
      })
    })
  }),
  tabularDataTypes: questionDetailsFullSchema.tabularDataTypesSchema.when(
    'questionType',
    {
      is: 'FileUploadField',
      then: Joi.array().when('fileTypes', {
        is: Joi.array().has(TABULAR_DATA),
        then: Joi.required().messages({
          '*': 'Choose the tabular data file types you accept'
        })
      })
    }
  ),
  enhancedAction: questionDetailsFullSchema.enhancedActionSchema,
  radioId: questionDetailsFullSchema.radioIdSchema,
  radioText: questionDetailsFullSchema.radioTextSchema.when('enhancedAction', {
    is: Joi.exist(),
    then: Joi.string().when('enhancedAction', {
      is: Joi.string().valid('add-item', 're-order'),
      then: Joi.string().optional().allow(''),
      otherwise: Joi.string().trim().required().messages({
        '*': 'Enter item text'
      })
    }),
    otherwise: Joi.string().optional().allow('')
  }),
  radioHint: questionDetailsFullSchema.radioHintSchema,
  radioValue: questionDetailsFullSchema.radioValueSchema,
  listItemsData: questionDetailsFullSchema.listItemsDataSchema,
  autoCompleteOptions: questionDetailsFullSchema.autoCompleteOptionsSchema.when(
    'questionType',
    {
      is: 'AutocompleteField',
      then: autoCompleteOptionsSchema.messages({
        'array.min': 'Enter at least one option for users to choose from',
        'array.includes': 'Enter options separated by a colon',
        'dsv.invalid': 'Enter options separated by a colon',
        'string.min': 'Enter at least one character',
        'string.empty': 'Enter at least one character',
        'array.unique': 'Duplicate option found'
      }),
      otherwise: Joi.forbidden()
    }
  ),
  jsEnabled: questionDetailsFullSchema.jsEnabledSchema,
  usePostcodeLookup: questionDetailsFullSchema.usePostcodeLookupSchema,
  paymentAmount: questionDetailsFullSchema.paymentAmountSchema.when(
    'questionType',
    {
      is: 'PaymentField',
      then: Joi.number()
        .required()
        .custom((value, helpers) => handlePrecision(value, helpers, 2))
        .messages({
          'any.required': 'Enter a payment amount',
          'number.min': PAYMENT_RANGE_ERROR_MESSAGE,
          'number.max': PAYMENT_RANGE_ERROR_MESSAGE,
          'number.base': PAYMENT_RANGE_ERROR_MESSAGE
        }),
      otherwise: Joi.number().empty('')
    }
  ),
  paymentDescription: questionDetailsFullSchema.paymentDescriptionSchema.when(
    'questionType',
    {
      is: 'PaymentField',
      then: Joi.string().required().messages({
        'string.empty': 'Enter a payment description',
        'string.max': 'Payment description must be 230 characters or less'
      }),
      otherwise: Joi.string().optional().allow('')
    }
  )
})

const ALL_LOCATION_HINTS = Object.values(locationHintDefaults)

/**
 * @param {ComponentType | undefined} questionType
 * @param {string | undefined} validationResult
 * @param {string | undefined} storedHint
 * @returns {string | undefined}
 */
function getLocationFieldHint(questionType, validationResult, storedHint) {
  if (!questionType) {
    return validationResult ?? storedHint
  }

  if (validationResult && ALL_LOCATION_HINTS.includes(validationResult)) {
    return getDefaultLocationHint(questionType)
  }

  if (storedHint && ALL_LOCATION_HINTS.includes(storedHint)) {
    return getDefaultLocationHint(questionType)
  }

  if (validationResult !== undefined) {
    return validationResult
  }
  if (storedHint) {
    return storedHint
  }
  return getDefaultLocationHint(questionType)
}

/**
 * @param {keyof Omit<FormEditorGovukField, 'errorMessage'>} fieldName
 * @param {FormComponentsDef | undefined} questionFields
 * @param {FormDefinition} definition
 * @returns {GovukField['value']}
 */
function getFieldValueFromSwitch(fieldName, questionFields, definition) {
  switch (fieldName) {
    case 'questionOptional':
      return `${questionFields?.options.required === false}`
    case 'question':
      return questionFields?.title
    case 'hintText':
      return questionFields?.hint
    case 'shortDescription':
      return questionFields?.shortDescription
    case 'declarationText': {
      const declaration = /** @type {DeclarationFieldComponent | undefined} */ (
        questionFields
      )
      return declaration?.content
    }
    case 'autoCompleteOptions':
      return mapListToTextareaStr(
        getListFromComponent(questionFields, definition)?.items
      )
    case 'usePostcodeLookup': {
      const addressField = /** @type {UkAddressFieldComponent | undefined} */ (
        questionFields
      )
      return `${addressField?.options.usePostcodeLookup === true}`
    }
    case 'paymentAmount': {
      const paymentField = /** @type {PaymentFieldComponent | undefined} */ (
        questionFields
      )
      return paymentField?.options.amount
        ? paymentField.options.amount.toFixed(2)
        : undefined
    }
    case 'paymentDescription': {
      const paymentField = /** @type {PaymentFieldComponent | undefined} */ (
        questionFields
      )
      return paymentField?.options.description
    }
    default:
      return undefined
  }
}

/**
 *
 * @param { keyof Omit<FormEditorGovukField, 'errorMessage'> } fieldName
 * @param { FormComponentsDef | undefined } questionFields
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {FormDefinition} definition
 * @param {ComponentType | undefined} currentQuestionType
 * @returns {GovukField['value']}
 */
export function getFieldValue(
  fieldName,
  questionFields,
  validation,
  definition,
  currentQuestionType
) {
  const validationResult = validation?.formValues[fieldName]

  // Special handling for hintText with location fields
  if (fieldName === 'hintText') {
    const questionType = currentQuestionType ?? questionFields?.type

    if (isLocationFieldType(questionType)) {
      const hintValue =
        typeof validationResult === 'string' ? validationResult : undefined
      return getLocationFieldHint(
        /** @type {ComponentType} */ (questionType),
        hintValue,
        questionFields?.hint
      )
    }
  }

  if (validationResult !== undefined) {
    if (fieldName === 'autoCompleteOptions') {
      return mapListToTextareaStr(/** @type {Item[]} */ (validationResult))
    }
    return validationResult
  }

  return getFieldValueFromSwitch(fieldName, questionFields, definition)
}

export const baseQuestionFields =
  /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.ShortDescription
  ])

export const autocompleteFields =
  /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.AutoCompleteOptions,
    QuestionBaseSettings.ShortDescription
  ])

export const ukAddressFields = /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
  QuestionBaseSettings.Question,
  QuestionBaseSettings.HintText,
  QuestionBaseSettings.QuestionOptional,
  QuestionBaseSettings.UsePostcodeLookup,
  QuestionBaseSettings.ShortDescription
])

export const declarationFields =
  /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.DeclarationText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.ShortDescription
  ])

export const fileUploadFields = /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
  QuestionBaseSettings.Question,
  QuestionBaseSettings.HintText,
  QuestionBaseSettings.QuestionOptional,
  QuestionBaseSettings.FileTypes,
  QuestionBaseSettings.ShortDescription
])

export const radiosOrCheckboxesFields =
  /** @type {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.ShortDescription,
    QuestionBaseSettings.RadiosOrCheckboxes
  ])

export const locationFields = /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
  QuestionBaseSettings.Question,
  QuestionBaseSettings.HintText,
  QuestionBaseSettings.QuestionOptional,
  QuestionBaseSettings.ShortDescription
])

export const hiddenFields = /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
  QuestionBaseSettings.Question
])

export const paymentFields = /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
  QuestionBaseSettings.PaymentAmount,
  QuestionBaseSettings.PaymentDescription
])

/**
 * Map of component types to their respective field lists
 * @type {Map<ComponentType, FormEditorGovukFieldBaseKeys[]>}
 */
const COMPONENT_TYPE_TO_FIELDS = new Map([
  [ComponentType.FileUploadField, fileUploadFields],
  [ComponentType.AutocompleteField, autocompleteFields],
  [ComponentType.UkAddressField, ukAddressFields],
  [ComponentType.DeclarationField, declarationFields],
  [ComponentType.RadiosField, radiosOrCheckboxesFields],
  [ComponentType.CheckboxesField, radiosOrCheckboxesFields],
  [ComponentType.SelectField, radiosOrCheckboxesFields],
  [ComponentType.EastingNorthingField, locationFields],
  [ComponentType.OsGridRefField, locationFields],
  [ComponentType.NationalGridFieldNumberField, locationFields],
  [ComponentType.LatLongField, locationFields],
  [ComponentType.HiddenField, hiddenFields],
  [ComponentType.PaymentField, paymentFields]
])

/**
 * @param { ComponentType | undefined } questionType
 * @returns {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]}
 */
export function getQuestionFieldList(questionType) {
  if (!questionType) {
    return baseQuestionFields
  }
  return COMPONENT_TYPE_TO_FIELDS.get(questionType) ?? baseQuestionFields
}

/**
 * @param { InputFieldsComponentsDef | undefined } questionFields
 * @param { ComponentType | undefined } questionType
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {FormDefinition} definition
 * @returns {GovukField[]}
 */
export function getFieldList(
  questionFields,
  questionType,
  validation,
  definition
) {
  const questionFieldList = getQuestionFieldList(questionType)
  return questionFieldList.map((fieldName) => {
    const value = getFieldValue(
      fieldName,
      questionFields,
      validation,
      definition,
      questionType
    )

    const field = {
      ...allBaseSettingsFields[fieldName],
      ...insertValidationErrors(validation?.formErrors[fieldName])
    }

    if (field.items) {
      // Handle checkbox/radio selections
      const strValue = typeof value === 'string' ? value.toString() : ''
      return {
        ...field,
        items: field.items.map((cb) => ({
          ...cb,
          checked: cb.value === strValue
        }))
      }
    }
    return {
      ...field,
      value
    }
  })
}

/**
 * @param { ComponentDef | undefined } questionFields
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
export function getFileUploadFields(questionFields, validation) {
  const formValues =
    /** @type { Record<keyof FormEditorGovukField, string[]>} */
    (
      validation?.formValues ??
        getSelectedFileTypesFromCSVMimeTypes(questionFields)
    )

  return {
    fileTypes: {
      ...allBaseSettingsFields.fileTypes,
      items: tickBoxes(allowedParentFileTypes, formValues.fileTypes),
      ...insertValidationErrors(validation?.formErrors.fileTypes)
    },
    documentTypes: {
      ...allBaseSettingsFields.documentTypes,
      items: tickBoxes(allDocumentTypes, formValues.documentTypes),
      ...insertValidationErrors(validation?.formErrors.documentTypes)
    },
    imageTypes: {
      ...allBaseSettingsFields.imageTypes,
      items: tickBoxes(allImageTypes, formValues.imageTypes),
      ...insertValidationErrors(validation?.formErrors.imageTypes)
    },
    tabularDataTypes: {
      ...allBaseSettingsFields.tabularDataTypes,
      items: tickBoxes(allTabularDataTypes, formValues.tabularDataTypes),
      ...insertValidationErrors(validation?.formErrors.tabularDataTypes)
    }
  }
}

/**
 * @import { FormDefinition, ComponentDef, FormEditor, FormEditorGovukField, GovukField, InputFieldsComponentsDef, Item, FormEditorGovukFieldBaseKeys, FormComponentsDef, UkAddressFieldComponent, DeclarationFieldComponent, PaymentFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
