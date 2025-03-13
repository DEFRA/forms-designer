import { ComponentType } from '@defra/forms-model'

import {
  QuestionAdvancedSettings,
  QuestionTypeDescriptions
} from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors, isCheckboxSelected } from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestion,
  getQuestionNum
} from '~/src/models/forms/editor-v2/common.js'
import { extraFields } from '~/src/models/forms/editor-v2/question-details-advanced-settings.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Determines if the details section should be expanded i.e. if there is a validation error or some data populated
 * in the details section
 * @param {string[]} optionalFieldNames
 * @param {ErrorDetailsItem[] | undefined} errorList
 * @param {FormEditorGovukField[]} optionalFields
 */
export function hasDataOrErrorForDisplay(
  optionalFieldNames,
  errorList,
  optionalFields
) {
  const fieldsInError = errorList ? errorList.map((x) => x.href) : []

  const errorFound = optionalFieldNames.some((field) => {
    return fieldsInError.some((err) => err === `#${field}`)
  })
  if (errorFound) {
    return true
  }

  const fields = /** @type {[string, GovukField][]} */ (
    Object.entries(optionalFields)
  )
  for (const [, fieldObj] of fields) {
    if (fieldObj.value !== undefined && fieldObj.value !== '') {
      return true
    }
  }

  return false
}

/**
 * @param {InputFieldsComponentsDef} question
 */
function mapToQuestionDetails(question) {
  return {
    question: question.title,
    hintText: question.hint,
    questionOptional: `${question.options.required === false}`,
    shortDescription: question.name
  }
}

/**
 * @param {InputFieldsComponentsDef} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 */
function questionDetailsFields(question, validation) {
  const formValues = validation?.formValues ?? mapToQuestionDetails(question)
  return /** @type {{ fields: FormEditorGovukField }} */ ({
    fields: {
      question: {
        name: 'question',
        id: 'question',
        label: {
          text: 'Question',
          classes: GOVUK_LABEL__M
        },
        value: formValues.question,
        ...insertValidationErrors(validation?.formErrors.question)
      },
      hintText: {
        name: 'hintText',
        id: 'hintText',
        label: {
          text: 'Hint text (optional)',
          classes: GOVUK_LABEL__M
        },
        rows: 3,
        value: formValues.hintText,
        ...insertValidationErrors(validation?.formErrors.hintText)
      },
      questionOptional: {
        name: 'questionOptional',
        id: 'questionOptional',
        classes: 'govuk-checkboxes--small',
        items: [
          {
            value: 'true',
            text: 'Make this question optional',
            checked: isCheckboxSelected(formValues.questionOptional)
          }
        ]
      },
      shortDescription: {
        id: 'shortDescription',
        name: 'shortDescription',
        idPrefix: 'shortDescription',
        label: {
          text: 'Short description',
          classes: GOVUK_LABEL__M
        },
        hint: {
          text: "Enter a short description for this question like 'licence period'. Short descriptions are used in error messages and on the check your answers page."
        },
        value: formValues.shortDescription,
        ...insertValidationErrors(validation?.formErrors.shortDescription)
      }
    }
  })
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ComponentType | undefined} questionType
 */
export function getDetails(
  metadata,
  definition,
  pageId,
  questionId,
  questionType
) {
  const formPath = formOverviewPath(metadata.slug)
  const pageNum = getPageNum(definition, pageId)
  const questionNum = getQuestionNum(definition, pageId, questionId)
  const question = getQuestion(definition, pageId, questionId)

  // Override question type if it has been passed in i.e. changed as part of the route to this page
  const questionOverride = /** @type {ComponentDef} */ (
    question ?? { schema: {}, options: {} }
  )
  questionOverride.type = questionType ?? questionOverride.type

  return {
    pageTitle: metadata.title,
    navigation: getFormSpecificNavigation(formPath, metadata, 'Editor'),
    question: questionOverride,
    questionNum,
    pageNum
  }
}

/**
 * @param {ComponentDef | undefined} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 * @returns {FormEditorGovukField[]}
 */
export function getExtraFields(question, validation) {
  let extraFieldNames = /** @type {string[]} */ ([])
  if (question?.type === ComponentType.TextField) {
    extraFieldNames = [
      QuestionAdvancedSettings.MinLength,
      QuestionAdvancedSettings.MaxLength,
      QuestionAdvancedSettings.Regex,
      QuestionAdvancedSettings.Classes
    ]
  }

  if (extraFieldNames.length) {
    return extraFields(
      extraFieldNames,
      /** @type {TextFieldComponent} */ (question),
      validation
    )
  }
  return /** @type {FormEditorGovukField[]} */ ([])
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ComponentType | undefined} questionType
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionDetailsViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  questionType,
  validation
) {
  const { pageTitle, navigation, question, pageNum, questionNum } = getDetails(
    metadata,
    definition,
    pageId,
    questionId,
    questionType
  )

  const { formErrors } = validation ?? {}

  const baseFields = questionDetailsFields(
    /** @type {InputFieldsComponentsDef} */ (question),
    validation
  )

  const extraFields = /** @type {GovukField[]} */ (
    getExtraFields(question, validation)
  )

  const extraFieldNames = extraFields.map((field) => Object.keys(field)[0])
  const allFieldNames = Object.keys(baseFields).concat(extraFieldNames)

  const errorList = buildErrorList(formErrors, allFieldNames)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    fields: baseFields.fields,
    extraFields,
    cardTitle: `Question ${questionNum}`,
    cardCaption: `Page ${pageNum}`,
    cardHeading: `Edit question ${questionNum}`,
    navigation,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionType: question.type,
    questionTypeDesc: QuestionTypeDescriptions.find(
      (x) => x.type === question.type
    )?.description,
    changeTypeUrl: editorv2Path(
      metadata.slug,
      `page/${pageId}/question/${questionId}`
    ),
    buttonText: SAVE_AND_CONTINUE,
    isOpen: hasDataOrErrorForDisplay(
      extraFieldNames,
      errorList,
      getExtraFields(question, validation)
    )
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormEditor, FormEditorGovukField, GovukField, InputFieldsComponentsDef, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
