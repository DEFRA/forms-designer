import { FormStatus, randomId } from '@defra/forms-model'

import { QuestionTypeDescriptions } from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import { getFieldValue } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  buildPreviewErrorsUrl,
  buildPreviewUrl
} from '~/src/models/forms/editor-v2/common.js'
import { getFieldComponentType } from '~/src/models/forms/editor-v2/page-fields.js'
import { getPreviewModel } from '~/src/models/forms/editor-v2/question-details/preview.js'
import {
  getDetails,
  getErrorTemplates,
  getSkipLink
} from '~/src/models/forms/editor-v2/question-details.js'
import { editorv2Path } from '~/src/models/links.js'
import {
  hintText,
  question,
  questionOptional,
  shortDescription
} from '~/src/questions/question-fields.js'

export class QuestionBase {
  /** @type {ComponentType} */
  type

  /** @type {GovukField[]} */
  baseFields

  /** @type {GovukField[]} */
  advancedFields = []

  /**
   * @param {ComponentType} type
   */
  constructor(type) {
    this.type = type

    this.baseFields = [question, hintText, questionOptional, shortDescription]
  }

  /**
   * @param {FormMetadata} metadata
   * @param {FormDefinition} definition
   * @param {string} pageId
   * @param {string} questionId
   * @param {string} stateId
   * @param {ValidationFailure<FormEditor>} [validation]
   * @param {QuestionSessionState} [state]
   */
  getViewModel(
    metadata,
    definition,
    pageId,
    questionId,
    stateId,
    validation,
    state
  ) {
    const details = getDetails(
      metadata,
      definition,
      pageId,
      questionId,
      this.type
    )
    const questionFieldsOverride = /** @type {ComponentDef} */ (
      state?.questionDetails ?? details.question
    )
    const basePageFields = this.applyValuesAndErrors(validation, definition)

    // getFieldList(

    const uploadFields = {}
    const enhancedFieldList = /** @type {GovukField[]} */ ([])
    const errorList = buildErrorList(validation?.formErrors)
    const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${details.pagePath}?force`
    const previewErrorsUrl = `${buildPreviewErrorsUrl(metadata.slug)}${details.pagePath}/${questionFieldsOverride.id}`
    const urlPageBase = editorv2Path(metadata.slug, `page/${pageId}`)
    const deleteUrl = `${urlPageBase}/delete/${questionId}`
    const changeTypeUrl = `${urlPageBase}/question/${questionId}/type/${stateId}`
    const pageHeading = details.pageTitle
    const pageTitle = `Edit question ${details.questionNum} - ${details.pageTitle}`
    const errorTemplates = getErrorTemplates(this.type)

    return {
      listDetails: undefined,
      state,
      enhancedFields: enhancedFieldList,
      ...baseModelFields(metadata.slug, pageTitle, pageHeading),
      name: details.question.name || randomId(),
      questionId,
      basePageFields,
      uploadFields,
      extraFields: this.advancedFields,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorTemplates,
      cardTitle: `Question ${details.questionNum}`,
      cardCaption: `Page ${details.pageNum}`,
      cardHeading: `Edit question ${details.questionNum}`,
      cardId: 'edit-question',
      navigation: details.navigation,
      errorList,
      formErrors: validation?.formErrors,
      formValues: validation?.formValues,
      model: getPreviewModel(this.baseFields, state, this.type),
      questionType: questionFieldsOverride.type,
      questionTypeDesc: QuestionTypeDescriptions.find(
        (x) => x.type === questionFieldsOverride.type
      )?.description,
      changeTypeUrl,
      buttonText: SAVE_AND_CONTINUE,
      previewPageUrl,
      previewErrorsUrl,
      deleteUrl,
      skipLink: getSkipLink(),
      isOpen: false,
      getFieldType: (/** @type {GovukField} */ field) =>
        getFieldComponentType(field)
    }
  }

  /**
   * @param { ValidationFailure<FormEditor> | undefined } validation
   * @param {FormDefinition} definition
   * @returns {GovukField[]}
   */
  applyValuesAndErrors(validation, definition) {
    return this.baseFields.map(({ name }) => {
      const fieldName =
        /** @type { keyof Omit<FormEditorGovukField, 'errorMessage'> } */ (name)
      const fieldDef = this.baseFields.find((x) => x.name === name)
      const value = getFieldValue(
        fieldName,
        // @ts-expect-error - temporary disable linting
        fieldDef,
        validation,
        definition
      )

      const field = {
        ...fieldDef,
        ...insertValidationErrors(validation?.formErrors[fieldName]),
        value
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
}

/**
 * @import { ComponentDef, ComponentType, FormEditorGovukField, QuestionSessionState, FormMetadata, FormDefinition, FormEditor, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
