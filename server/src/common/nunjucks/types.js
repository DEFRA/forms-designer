/**
 * @typedef {object} MacroOptions
 * @property {string} [callBlock] - Nunjucks call block content
 * @property {object} [params] - Nunjucks macro params
 */

/**
 * @typedef {object} RenderOptions
 * @property {object} [context] - Nunjucks render context
 */

/**
 * @typedef {object} JoiExpressionReturn
 * @property {string} source - The source of the Joi expression
 * @property {any} _functions - The functions defined in the Joi expression
 * @property {Function} render - The render function of the Joi expression
 */

/**
 * @typedef {JoiExpressionReturn|string} JoiExpression
 */
