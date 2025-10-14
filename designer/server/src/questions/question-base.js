import { FormStatus, randomId } from '@defra/forms-model'

import { QuestionTypeDescriptions } from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
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
  getSkipLink,
  hasDataOrErrorForDisplay
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

  /** @type {DesignerField[]} */
  baseFields

  /** @type {DesignerField[]} */
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
    const headerDetails = getDetails(
      metadata,
      definition,
      pageId,
      questionId,
      this.type
    )
    const questionFieldsOverride = /** @type {ComponentDef} */ (
      state?.questionDetails ?? headerDetails.question
    )
    const basePageFields = this.applyValuesAndErrors(
      this.baseFields,
      validation,
      questionFieldsOverride
    )
    const extraFields = this.applyValuesAndErrors(
      this.advancedFields,
      validation,
      questionFieldsOverride
    )

    const uploadFields = {}
    const enhancedFieldList = /** @type {GovukField[]} */ ([])
    const errorList = buildErrorList(validation?.formErrors)
    const previewPageUrl = `${buildPreviewUrl(metadata.slug, FormStatus.Draft)}${headerDetails.pagePath}?force`
    const previewErrorsUrl = `${buildPreviewErrorsUrl(metadata.slug)}${headerDetails.pagePath}/${questionFieldsOverride.id}`
    const urlPageBase = editorv2Path(metadata.slug, `page/${pageId}`)
    const deleteUrl = `${urlPageBase}/delete/${questionId}`
    const changeTypeUrl = `${urlPageBase}/question/${questionId}/type/${stateId}`
    const pageHeading = headerDetails.pageTitle
    const pageTitle = `Edit question ${headerDetails.questionNum} - ${headerDetails.pageTitle}`
    const errorTemplates = getErrorTemplates(this.type)

    return {
      listDetails: undefined,
      state,
      enhancedFields: enhancedFieldList,
      ...baseModelFields(metadata.slug, pageTitle, pageHeading),
      name: headerDetails.question.name || randomId(),
      questionId,
      basePageFields,
      uploadFields,
      extraFields,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorTemplates,
      cardTitle: `Question ${headerDetails.questionNum}`,
      cardCaption: `Page ${headerDetails.pageNum}`,
      cardHeading: `Edit question ${headerDetails.questionNum}`,
      cardId: 'edit-question',
      navigation: headerDetails.navigation,
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
      isOpen: hasDataOrErrorForDisplay(
        extraFields.map((x) => /** @type {string} */ (x.name)),
        errorList,
        extraFields
      ),
      getFieldType: (/** @type {GovukField} */ field) =>
        getFieldComponentType(field)
    }
  }

  /**
   * @param {DesignerField[]} fields
   * @param { ValidationFailure<FormEditor> | undefined } validation
   * @param {ComponentDef} questionFields
   * @returns {DesignerField[]}
   */
  applyValuesAndErrors(fields, validation, questionFields) {
    return fields.map((field) => {
      const fieldName =
        /** @type { keyof Omit<FormEditorGovukField, 'errorMessage'> } */ (
          field.name
        )
      const value =
        validation?.formValues[fieldName] ??
        field.designer.getValue(questionFields)

      if (field.items) {
        // Handle checkbox/radio selections
        const strValue = typeof value !== 'object' ? value?.toString() : ''
        return {
          ...field,
          items: field.items.map((cb) => ({
            ...cb,
            checked: cb.value === strValue
          })),
          ...insertValidationErrors(validation?.formErrors[fieldName])
        }
      }

      return /** @type {DesignerField} */ ({
        ...field,
        ...insertValidationErrors(validation?.formErrors[fieldName]),
        value
      })
    })
  }
}

/**
 * @import { ComponentDef, ComponentType, DesignerField, FormEditorGovukField, QuestionSessionState, FormMetadata, FormDefinition, FormEditor, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
