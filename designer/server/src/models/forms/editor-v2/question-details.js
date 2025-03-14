import { ComponentType, randomId } from '@defra/forms-model'

import { questionTypeDescriptions } from '~/src/common/constants/editor.js'
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
import { textfieldExtraOptionsFields } from '~/src/models/forms/editor-v2/extra-options/textfield.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

/**
 * Determines if the details section should be expanded i.e. if there is a validation error or some data populated
 * in the details section
 * @param {string[]} optionalFieldNames
 * @param {ErrorDetailsItem[] | undefined} errorList
 * @param {{ fields: FormEditorGovukField }} optionalFields
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
    Object.entries(optionalFields.fields)
  )
  for (const [, fieldObj] of fields) {
    if (fieldObj.value !== undefined && fieldObj.value !== '') {
      return true
    }
  }

  return false
}

/**
 * @param {ComponentDef} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 */
export function combineBaseAndOptionalFields(question, validation) {
  const baseFields = questionDetailsFields(
    /** @type {InputFieldsComponentsDef} */ (question),
    validation
  )

  const optionalFields = /** @type {FormEditorGovukFieldList} */ (
    getOptionalFields(question, validation)
  )

  const combined = {
    fields: /** @type {FormEditorGovukField} */ ({
      ...baseFields.fields,
      ...optionalFields.fields
    }),
    optionalFieldsPartial: optionalFields.optionalFieldsPartial
  }

  return {
    allFieldNames: Object.keys(combined.fields),
    optionalFieldNames: Object.keys(optionalFields.fields),
    fields: /** @type {FormEditorGovukField} */ (combined.fields),
    optionalFieldsPartial: combined.optionalFieldsPartial
  }
}
/**
 * @param { InputFieldsComponentsDef | undefined } question
 */
export function mapToQuestionDetails(question) {
  return {
    name: question?.name ?? randomId(),
    question: question?.title,
    hintText: question?.hint,
    questionOptional: `${question?.options.required === false}`,
    shortDescription: question?.shortDescription
  }
}

/**
 * @param { InputFieldsComponentsDef | undefined } question
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function questionDetailsFields(question, validation) {
  const formValues = validation?.formValues ?? mapToQuestionDetails(question)
  return /** @type {{ fields: FormEditorGovukField }} */ ({
    fields: {
      name: {
        value: formValues.name
      },
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
 * @returns {{
 *   fields: FormEditorGovukField,
 *   optionalFieldsPartial: string | null | undefined
 * }}
 */
export function getOptionalFields(question, validation) {
  if (question?.type === ComponentType.TextField) {
    return textfieldExtraOptionsFields(
      /** @type {TextFieldComponent} */ (question),
      validation
    )
  }
  return {
    fields: {},
    optionalFieldsPartial: null
  }
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

  const combinedFields = combineBaseAndOptionalFields(question, validation)

  const errorList = buildErrorList(formErrors, combinedFields.allFieldNames)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    fields: combinedFields.fields,
    optionalFieldsPartial: combinedFields.optionalFieldsPartial,
    cardTitle: `Question ${questionNum}`,
    cardCaption: `Page ${pageNum}`,
    cardHeading: `Edit question ${questionNum}`,
    navigation,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionType: question.type,
    questionTypeDesc: questionTypeDescriptions.find(
      (x) => x.type === question.type
    )?.description,
    changeTypeUrl: editorv2Path(
      metadata.slug,
      `page/${pageId}/question/${questionId}`
    ),
    buttonText: SAVE_AND_CONTINUE,
    isOpen: hasDataOrErrorForDisplay(
      combinedFields.optionalFieldNames,
      errorList,
      getOptionalFields(question, validation)
    )
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormEditor, FormEditorGovukField, FormEditorGovukFieldList, GovukField, InputFieldsComponentsDef, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
