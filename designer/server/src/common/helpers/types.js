/**
 * @typedef {{ text: string, href?: string }} ErrorDetailsItem
 * @typedef {Record<string, ErrorDetailsItem>} ErrorDetails
 */

/**
 * @template {object} [Schema=object]
 * @typedef {object} ValidationFailure
 * @property {ErrorDetails} formErrors - Formatted errors for the error summary
 * @property {Schema} formValues - Form POST payload from Hapi request
 * @property {string} [formErrorsDescription] - Description for the error summary
 */
