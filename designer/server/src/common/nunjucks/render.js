import Joi from 'joi'

import { environment } from '~/src/common/nunjucks/environment.js'

/**
 * Render Nunjucks macro
 * @param {string} macroName
 * @param {string} macroPath
 * @param {RenderOptions & MacroOptions} [options]
 */
export function macro(macroName, macroPath, options) {
  const macroParams = JSON.stringify(options?.params, undefined, 2)
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  if (options?.callBlock) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${options.callBlock}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

  return string(macroString, options)
}

/**
 * Render Nunjucks code
 * @param {string} viewString - Nunjucks string to render
 * @param {RenderOptions} [options]
 */
export function string(viewString, options) {
  return environment.renderString(viewString, options?.context ?? {})
}

/**
 * Render Nunjucks view
 * @param {string} viewPath
 * @param {RenderOptions} [options]
 */
export function view(viewPath, options) {
  return environment.render(viewPath, options?.context)
}

/**
 * @param {string} expr
 * @returns {JoiExpression}
 */
export function createJoiExpression(expr) {
  // TODO - work out why type is not valid
  return /** @type {JoiExpression} */ (Joi.expression(expr))
}

/**
 * Render a Joi template (expression) or tokenised string to generate complete error message
 * @param { JoiExpression | string } template
 * @param {{ label?: string, limit?: number | string, title?: string }} [local]
 * @returns {string}
 */
export function expandTemplate(template, local = {}) {
  const options = { errors: { escapeHtml: false } }
  const prefs = { errors: { wrap: { label: false } } }

  const templateExpression =
    typeof template === 'string' ? createJoiExpression(template) : template

  // @ts-expect-error Joi types are messed up
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return templateExpression.render('', {}, prefs, local, options)
}

/**
 * @import { MacroOptions, RenderOptions, JoiExpression } from '~/src/common/nunjucks/types.js'
 */
