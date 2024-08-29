/**
 * @typedef {{ text: string, href?: string }} ErrorDetailsItem
 * @typedef {Record<string, ErrorDetailsItem>} ErrorDetails
 */

/**
 * @template {object} [Schema=object]
 * @typedef {object} ValidationFailure
 * @typedef {object} ValidationFailureFile
 * @property {ErrorDetails} formErrors - Formatted errors for error summary
 * @property {Schema} formValues - Form POST payload from Hapi request
 */
