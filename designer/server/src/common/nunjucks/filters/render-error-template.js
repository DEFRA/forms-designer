import Joi from 'joi'

import { expandTemplate } from '~/src/common/nunjucks/render.js'
import { determineLimit, insertTags } from '~/src/lib/error-preview-helper.js'

/**
 * @param {{ type: string, template: Joi.JoiExpression }} template - error template
 * @param {{ basePageFields: { name?: string, id?: string, label?: { text: string }, value?: string }[], extraFields: GovukField[] }} viewModel
 * @param {ComponentType} questionType
 */
export function renderErrorTemplate(template, viewModel, questionType) {
  const shortDescriptionField = viewModel.basePageFields.find(
    (x) => x.id === 'shortDescription'
  )

  /** @type { string | JoiExpression } */
  let newTemplate
  /** @type { string | JoiExpression } */
  if (typeof template.template === 'string') {
    // Handle simple string template
    newTemplate = insertTags(template.template, template.type)
  } else {
    // Handle Joi.expression template
    const templateStr = insertTags(template.template.source, template.type)
    newTemplate = Joi.expression(templateStr, {
      functions: template.template._functions
    })
  }

  const renderedText = expandTemplate(newTemplate, {
    label: shortDescriptionField?.value,
    title: shortDescriptionField?.value,
    limit: determineLimit(template.type, viewModel.extraFields, questionType)
  })
  return renderedText
}

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 * @import { JoiExpression } from 'joi'
 */
