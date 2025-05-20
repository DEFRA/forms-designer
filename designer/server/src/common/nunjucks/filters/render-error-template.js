import Joi from 'joi'

import { expandTemplate } from '~/src/common/nunjucks/render.js'
import { determineLimit, insertTags } from '~/src/lib/error-preview-helper.js'

/**
 * @param {{ type: string, template: JoiExpression }} template - error template
 * @param {{ basePageFields: { name?: string, id?: string, label?: { text: string }, value?: string }[], extraFields: GovukField[] }} viewModel
 * @param {ComponentType} questionType
 */
export function renderErrorTemplate(template, viewModel, questionType) {
  const shortDescriptionField = viewModel.basePageFields.find(
    (x) => x.id === 'shortDescription'
  )

  /** @type { string | JoiExpression } */
  let newTemplate
  if (typeof template.template === 'string') {
    // Handle simple string template
    newTemplate = insertTags(template.template, template.type)
  } else {
    // Handle Joi.expression template
    const templateObj = /** @type {JoiExpressionReturn} */ (template.template)
    const templateStr = insertTags(templateObj.source, template.type)
    newTemplate = Joi.expression(
      templateStr,
      /** @type {any} */ ({
        functions: templateObj._functions
      })
    )
  }

  const renderedText = expandTemplate(newTemplate, {
    label: shortDescriptionField?.value ?? '[Short description]',
    title: shortDescriptionField?.value ?? '[Short description]',
    limit: determineLimit(template.type, viewModel.extraFields, questionType)
  })
  return renderedText
}

/**
 * @import { ComponentType, GovukField } from '@defra/forms-model'
 * @import { JoiExpression, JoiExpressionReturn } from '~/src/common/nunjucks/types.js'
 */
