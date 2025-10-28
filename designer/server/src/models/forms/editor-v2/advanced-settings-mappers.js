import { ComponentType } from '@defra/forms-model'

import { isCheckboxSelected, isListComponentType } from '~/src/lib/utils.js'
import {
  getAdditionalOptions,
  getAdditionalSchema,
  mapExtraRootFields
} from '~/src/models/forms/editor-v2/advanced-settings-helpers.js'
import { mapPayloadToFileMimeTypes } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import { getDefaultLocationHint } from '~/src/models/forms/editor-v2/location-hint-defaults.js'

/**
 * Maps FormEditorInputQuestion payload to FileUploadField component
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<FileUploadFieldComponent>}
 */
export function mapFileUploadQuestionDetails(payload) {
  const additionalOptions = getAdditionalOptions(payload)
  const additionalSchema = getAdditionalSchema(payload)
  const extraRootFields = mapExtraRootFields(payload)
  const fileTypes = mapPayloadToFileMimeTypes(payload)

  return {
    type: ComponentType.FileUploadField,
    title: payload.question,
    name: payload.name,
    shortDescription: payload.shortDescription,
    hint: payload.hintText,
    ...extraRootFields,
    options: {
      required: !isCheckboxSelected(payload.questionOptional),
      ...additionalOptions,
      ...fileTypes
    },
    schema: { ...additionalSchema }
  }
}

/**
 * Maps FormEditorInputQuestion payload to List Component
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapListComponentFromPayload(payload) {
  const baseComponentDetails = mapBaseQuestionDetails(payload)
  return {
    ...baseComponentDetails,
    list: 'list' in baseComponentDetails ? baseComponentDetails.list : ''
  }
}

/**
 * Maps FormEditorInputQuestion payload to base component details
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapBaseQuestionDetails(payload) {
  const additionalOptions = getAdditionalOptions(payload)
  const additionalSchema = getAdditionalSchema(payload)
  const extraRootFields = mapExtraRootFields(payload)

  const locationFieldTypes = [
    ComponentType.EastingNorthingField,
    ComponentType.OsGridRefField,
    ComponentType.NationalGridFieldNumberField,
    ComponentType.LatLongField
  ]

  const questionType = /** @type {ComponentType} */ (payload.questionType)
  const isLocationField =
    payload.questionType && locationFieldTypes.includes(questionType)

  // Set default hint text for location fields if no hint is provided
  let hintText = payload.hintText
  if (!hintText && isLocationField) {
    hintText = getDefaultLocationHint(questionType)
  }

  const baseComponent = {
    type: payload.questionType,
    title: payload.question,
    name: payload.name,
    shortDescription: payload.shortDescription,
    hint: hintText,
    ...extraRootFields,
    options: {
      required: !isCheckboxSelected(payload.questionOptional),
      ...additionalOptions
    }
  }

  if (!isLocationField) {
    return /** @type {Partial<ComponentDef>} */ ({
      ...baseComponent,
      schema: { ...additionalSchema }
    })
  }

  return /** @type {Partial<ComponentDef>} */ (baseComponent)
}

/**
 * Maps FormEditorInputQuestion payload to appropriate component details
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapQuestionDetails(payload) {
  if (payload.questionType === ComponentType.FileUploadField) {
    return mapFileUploadQuestionDetails(payload)
  }
  if (
    isListComponentType(
      /** @type { ComponentType | undefined } */ (payload.questionType)
    )
  ) {
    return mapListComponentFromPayload(payload)
  }
  return mapBaseQuestionDetails(payload)
}

/**
 * @import { ComponentDef, FormEditorInputQuestion, FileUploadFieldComponent } from '@defra/forms-model'
 */
