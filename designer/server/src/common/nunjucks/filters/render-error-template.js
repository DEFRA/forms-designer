import { ComponentType } from '@defra/forms-model'
import Joi from 'joi'

import { expandTemplate } from '~/src/common/nunjucks/render.js'
import { determineLimit, insertTags } from '~/src/lib/error-preview-helper.js'

/**
 * @typedef {{
 *   name?: string;
 *   id?: string;
 *   label?: { text: string };
 *   value?: string;
 * }} BasePageFields
 */

const basePageFieldsFallback = /** @type {BasePageFields[]} */ ([])
const extraFieldsFallback = /** @type {GovukField[]} */ ([])

/**
 * Check if component type is a location field
 * @param {ComponentType} questionType
 * @returns {boolean}
 */
export function isLocationField(questionType) {
  return [
    ComponentType.EastingNorthingField,
    ComponentType.LatLongField,
    ComponentType.OsGridRefField,
    ComponentType.NationalGridFieldNumberField
  ].includes(questionType)
}

/**
 * Get the default label text for error messages based on question type
 * @param {ComponentType} questionType
 * @returns {string}
 */
export function getDefaultErrorLabel(questionType) {
  switch (questionType) {
    case ComponentType.EastingNorthingField:
      return 'easting and northing'
    case ComponentType.LatLongField:
      return 'latitude and longitude'
    case ComponentType.OsGridRefField:
      return 'OS grid reference'
    case ComponentType.NationalGridFieldNumberField:
      return 'national grid reference'
    default:
      return '[Short description]'
  }
}

/**
 * Check if error type is a base error (like "Enter...") vs validation error
 * @param {string} errorType
 * @returns {boolean}
 */
export function isBaseError(errorType) {
  return ['string.empty', 'any.required', 'required', 'base'].includes(
    errorType
  )
}

/**
 * Process template and add error preview tags
 * @param {string | JoiExpression} template
 * @param {string} type
 * @param {boolean} shouldMarkFixed
 * @returns {string | JoiExpression}
 */
export function processTemplate(template, type, shouldMarkFixed) {
  if (typeof template === 'string') {
    return insertTags(template, type, shouldMarkFixed)
  }

  // Handle Joi.expression template
  const templateObj = /** @type {JoiExpressionReturn} */ (template)
  const templateStr = insertTags(templateObj.source, type, shouldMarkFixed)
  return Joi.expression(
    templateStr,
    /** @type {any} */ ({
      functions: templateObj._functions
    })
  )
}

/**
 * Determine the label text for an error message
 * @param {ComponentType} questionType
 * @param {boolean} baseError
 * @param {BasePageFields | undefined} shortDescriptionField
 * @returns {string}
 */
export function determineLabelText(
  questionType,
  baseError,
  shortDescriptionField
) {
  // For location fields' base errors only, always use the component name (not the short description)
  if (isLocationField(questionType) && baseError) {
    return getDefaultErrorLabel(questionType)
  }

  // For all other cases, use short description if provided, otherwise use default
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return shortDescriptionField?.value || getDefaultErrorLabel(questionType)
}

/**
 * @param {{ type: string, template: JoiExpression }} template - error template
 * @param {{ basePageFields?: BasePageFields[], extraFields?: GovukField[] }} viewModel
 * @param {ComponentType} questionType
 */
export function renderErrorTemplate(template, viewModel, questionType) {
  const basePageFields = viewModel.basePageFields ?? basePageFieldsFallback
  const extraFields = viewModel.extraFields ?? extraFieldsFallback

  const shortDescriptionField = basePageFields.find(
    (x) => x.id === 'shortDescription'
  )

  const baseError = isBaseError(template.type)
  const shouldMarkFixed = isLocationField(questionType) && baseError

  const processedTemplate = processTemplate(
    template.template,
    template.type,
    shouldMarkFixed
  )

  const labelText = determineLabelText(
    questionType,
    baseError,
    shortDescriptionField
  )

  return expandTemplate(processedTemplate, {
    label: labelText,
    title: labelText,
    limit: determineLimit(template.type, extraFields, questionType)
  })
}

/**
 * @import { GovukField } from '@defra/forms-model'
 * @import { JoiExpression, JoiExpressionReturn } from '~/src/common/nunjucks/types.js'
 */
