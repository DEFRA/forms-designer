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
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {InputFieldsComponentsDef | undefined} question
 */
function mapToQuestionDetails(question) {
  if (!question) {
    return {}
  }
  return {
    question: question.title,
    hintText: question.hint,
    questionOptional: `${question.options.required === false}`,
    shortDescription: question.name
  }
}

/**
 * @param {InputFieldsComponentsDef | undefined} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 */
function questionDetailsFields(question, validation) {
  const formValues = validation?.formValues ?? mapToQuestionDetails(question)
  return {
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
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 */
export function getDetails(metadata, definition, pageId, questionId) {
  const formPath = formOverviewPath(metadata.slug)
  const pageNum = getPageNum(definition, pageId)
  const questionNum = getQuestionNum(definition, pageId, questionId)
  return {
    pageTitle: metadata.title,
    navigation: getFormSpecificNavigation(formPath, metadata, 'Editor'),
    question: getQuestion(definition, pageId, questionId),
    questionNum,
    pageNum
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
    questionId
  )

  const { formErrors } = validation ?? {}

  if (!questionType) {
    questionType = question?.type
  }

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    cardTitle: `Question ${questionNum}`,
    cardCaption: `Page ${pageNum}`,
    cardHeading: `Edit question ${questionNum}`,
    navigation,
    errorList: buildErrorList(formErrors, [
      'question',
      'shortDescription',
      'hintText'
    ]),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    ...questionDetailsFields(
      /** @type {InputFieldsComponentsDef} */ (question),
      validation
    ),
    questionType,
    buttonText: SAVE_AND_CONTINUE
  }
}

/**
 * @import { ComponentType, FormMetadata, FormDefinition, FormEditor, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
