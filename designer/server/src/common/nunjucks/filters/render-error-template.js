import Joi from 'joi'

import { expandTemplate } from '~/src/common/nunjucks/render.js'

/**
 * @param {string} templateStr
 * @param {string} type
 */
function insertTags(templateStr, type) {
  const delimiterRegex = /({{|}})/
  const parts = templateStr.split(delimiterRegex)
  const resultParts = []
  for (const part of parts) {
    if (part.includes('#label')) {
      resultParts.push(
        `<span class="error-preview-short-desc">{{${part}}}</span>`
      )
    } else if (part.includes('#limit')) {
      resultParts.push(`<span class="error-preview-${type}">{{${part}}}</span>`)
    } else if (part !== '{{' && part !== '}}') {
      resultParts.push(part)
    }
  }
  return resultParts.join('')
}

/**
 * @param {{ type: string, template: Joi.JoiExpression }} template - error template
 * @param {{ basePageFields: { name?: string, id?: string, label?: { text: string }, value?: string }[], extraFields: GovukField[] }} viewModel
 */
export function renderErrorTemplate(template, viewModel) {
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
  // console.log('template.temp', newTemplate)
  const renderedText = expandTemplate(newTemplate, {
    label: shortDescriptionField?.value,
    limit: '15'
  })
  return renderedText
}

/**
 * @import { GovukField } from '@defra/forms-model'
 * @import { JoiExpression } from 'joi'
 */
