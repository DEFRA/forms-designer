import { ComponentType } from '@defra/forms-model'

import { isLocationFieldType } from '~/src/common/constants/component-types.js'
import { isCheckboxSelected, isListComponentType } from '~/src/lib/utils.js'
import {
  getAdditionalOptions,
  getAdditionalSchema,
  mapExtraRootFields
} from '~/src/models/forms/editor-v2/advanced-settings-helpers.js'
import { mapPayloadToFileMimeTypes } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  getDefaultLocationHint,
  locationHintDefaults
} from '~/src/models/forms/editor-v2/location-hint-defaults.js'

const ALL_LOCATION_HINTS = Object.values(locationHintDefaults)

/**
 * Maps FormEditorInputQuestion payload to FileUploadField component
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<FileUploadFieldComponent>}
 */
export function mapFileUploadQuestionDetails(payload) {
  const additionalOptions = getAdditionalOptions(payload)
  const additionalSchema = getAdditionalSchema(payload)
  const fileTypes = mapPayloadToFileMimeTypes(payload)

  const baseQuestionDetails = mapBaseQuestionDetails(payload)

  return /** @type {Partial<FileUploadFieldComponent>} */ ({
    ...baseQuestionDetails,
    type: ComponentType.FileUploadField,
    schema: { ...additionalSchema },
    options: {
      required: !isCheckboxSelected(payload.questionOptional),
      ...additionalOptions,
      ...fileTypes
    }
  })
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

  let hintText = payload.hintText
  const questionType = /** @type {ComponentType | undefined} */ (
    payload.questionType
  )
  const isLocationField = isLocationFieldType(questionType)

  // For location fields, reset to default hint if no hint text is provided
  // or the hint text matches one of the standard location hints (user may have switched location field types)
  if (isLocationField && (!hintText || ALL_LOCATION_HINTS.includes(hintText))) {
    hintText = getDefaultLocationHint(
      /** @type {ComponentType} */ (questionType)
    )
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
