import { isConditionWrapperV2 } from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { getFormSpecificNavigation } from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

export const EMAIL_ACTIONS_HEADING = 'Email actions'
export const BACK_TO_ADVANCED_SETTINGS = 'Back to advanced settings'
export const NO_CONDITION_VALUE = ''
export const NO_CONDITION_TEXT = 'Every submission (no condition)'

/**
 * Anchor of the add/change form, used to bring it into view when the author
 * opens an address for amending or is sent back to correct an error.
 */
export const EMAIL_FORM_ANCHOR = '#email-address-form'

export const REMOVED_EMAIL_PREFIX = 'Removed email:'

/**
 * Maximum number of additional email addresses a form can have.
 */
export const MAX_ADDITIONAL_EMAILS = 20

/**
 * Output format versions the submission pipeline understands, newest first.
 * Human-readable submissions are always sent as the latest version, so only the
 * machine-readable versions are offered as a choice.
 * @type {{ human: string[], machine: string[] }}
 */
export const OUTPUT_VERSIONS = {
  human: ['2'],
  machine: ['2', '1']
}

/**
 * The version used when none is supplied - always the newest.
 * @param {OutputAudience} audience
 */
export function latestVersion(audience) {
  return OUTPUT_VERSIONS[audience][0]
}

/**
 * @param {OutputAudience} audience
 * @param {string} version
 */
export function formatDescription(audience, version) {
  return audience === 'machine'
    ? `Machine-readable (version ${version})`
    : 'Human-readable'
}

/**
 * The default email inbox is held on the form metadata, and the format it is
 * sent in on the form definition.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function buildDefaultEmail(metadata, definition) {
  const audience = definition.output?.audience ?? 'human'
  const version = definition.output?.version ?? latestVersion(audience)

  return {
    emailAddress: metadata.notificationEmail,
    format: formatDescription(audience, version),
    changeHref: `/library/${metadata.slug}/edit/notification-email`
  }
}

/**
 * All V2 conditions, sorted for display.
 * @param {FormDefinition} definition
 */
export function getV2Conditions(definition) {
  return definition.conditions
    .filter(isConditionWrapperV2)
    .sort((condA, condB) => condA.displayName.localeCompare(condB.displayName))
}

/**
 * @param {FormDefinition} definition
 * @param {string} [conditionId]
 */
export function getConditionName(definition, conditionId) {
  if (!conditionId) {
    return NO_CONDITION_TEXT
  }

  return (
    getV2Conditions(definition).find((cond) => cond.id === conditionId)
      ?.displayName ?? NO_CONDITION_TEXT
  )
}

/**
 * The address that has just been removed, written out in full. It repeats the
 * three details the table held, so the author can see exactly what has gone -
 * the same address can appear more than once under different formats and
 * conditions.
 * @param {FormDefinition} definition
 * @param {Output} output
 */
export function describeRemovedOutput(definition, output) {
  const format = formatDescription(output.audience, output.version)
  const condition = getConditionName(definition, output.condition)

  return `${REMOVED_EMAIL_PREFIX} ${output.emailAddress} in ${format} format, sent: ${condition}.`
}

/**
 * Options for the 'when should submissions be sent' select
 * @param {FormDefinition} definition
 * @param {string} [selectedConditionId]
 */
export function buildConditionItems(definition, selectedConditionId) {
  return [
    {
      text: NO_CONDITION_TEXT,
      value: NO_CONDITION_VALUE,
      selected: !selectedConditionId
    },
    ...getV2Conditions(definition).map((condition) => ({
      text: condition.displayName,
      value: condition.id,
      selected: condition.id === selectedConditionId
    }))
  ]
}

/**
 * The additional email addresses held in `outputs`, listed for display.
 * @param {string} slug
 * @param {FormDefinition} definition
 */
export function buildOutputRows(slug, definition) {
  const baseUrl = editorv2Path(slug, 'email-actions')
  const linkClasses = 'govuk-link govuk-link--no-visited-state'

  return (definition.outputs ?? []).map((output, index) => {
    // The anchor drops the author at the form holding the address they picked,
    // which sits below the table
    const changeLink = `<a class="${linkClasses}" href="${baseUrl}/${index}${EMAIL_FORM_ANCHOR}">Change<span class="govuk-visually-hidden"> ${output.emailAddress}</span></a>`
    const removeButton = `<form method="post" action="${baseUrl}/${index}/remove" class="app-inline-form"><button type="submit" class="govuk-link">Remove<span class="govuk-visually-hidden"> ${output.emailAddress}</span></button></form>`

    return [
      { text: output.emailAddress },
      { text: getConditionName(definition, output.condition) },
      { text: formatDescription(output.audience, output.version) },
      {
        html: `<div class="app-table-actions">${changeLink}&nbsp;<span class="app-vertical-divider">|</span>&nbsp;${removeButton}</div>`
      }
    ]
  })
}

/**
 * The values shown in the add/edit form - either the submitted values (when
 * validation failed), the output being edited, or the empty defaults.
 * @param {FormDefinition} definition
 * @param {number} [editIndex]
 * @param {Partial<EmailActionFormValues>} [formValues]
 * @returns {EmailActionFormValues}
 */
export function resolveFormValues(definition, editIndex, formValues) {
  const output =
    editIndex === undefined ? undefined : definition.outputs?.at(editIndex)

  const audience = /** @type {OutputAudience} */ (
    formValues?.audience ?? output?.audience ?? 'human'
  )

  return {
    condition: formValues?.condition ?? output?.condition ?? NO_CONDITION_VALUE,
    emailAddress: formValues?.emailAddress ?? output?.emailAddress ?? '',
    audience,
    machineVersion:
      formValues?.machineVersion ??
      (output?.audience === 'machine' ? output.version : undefined) ??
      latestVersion('machine')
  }
}

/**
 * Second-level radios revealed when machine-readable is chosen, listing the
 * supported versions newest first. Only worth showing when there is a choice.
 * @param {EmailActionFormValues} values
 */
export function buildMachineVersionHtml(values) {
  if (OUTPUT_VERSIONS.machine.length < 2) {
    return undefined
  }

  const radios = OUTPUT_VERSIONS.machine
    .map((version, index) => {
      const id = `machineVersion-${version}`
      const checked = values.machineVersion === version ? ' checked' : ''

      return `<div class="govuk-radios__item">
        <input class="govuk-radios__input" id="${id}" name="machineVersion" type="radio" value="${version}"${checked}>
        <label class="govuk-label govuk-radios__label" for="${id}">v${version}${index === 0 ? ' (latest)' : ''}</label>
      </div>`
    })
    .join('')

  return `<div class="govuk-form-group">
    <fieldset class="govuk-fieldset">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Which version?</legend>
      <div class="govuk-radios govuk-radios--small" data-module="govuk-radios">${radios}</div>
    </fieldset>
  </div>`
}

/**
 * @param {EmailActionFormValues} values
 */
export function buildFormatItems(values) {
  const machineVersionHtml = buildMachineVersionHtml(values)

  return [
    {
      text: 'Human-readable',
      value: 'human',
      hint: { text: 'Easy for people to read and process.' },
      checked: values.audience === 'human'
    },
    {
      text: 'Machine-readable',
      value: 'machine',
      hint: { text: 'Structured data for automated systems.' },
      checked: values.audience === 'machine',
      conditional: machineVersionHtml ? { html: machineVersionHtml } : undefined
    }
  ]
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {EmailActionsViewModelOptions} [options]
 */
export function emailActionsViewModel(metadata, definition, options = {}) {
  const { editIndex, validation, notification, notificationDetail } = options

  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const pageHeading = EMAIL_ACTIONS_HEADING
  const pageCaption = metadata.title
  const pageTitle = `${pageHeading} - ${pageCaption}`

  const isEditing = editIndex !== undefined
  const values = resolveFormValues(
    definition,
    editIndex,
    validation?.formValues
  )
  const outputRows = buildOutputRows(metadata.slug, definition)

  return {
    backLink: {
      href: editorv2Path(metadata.slug, 'advanced-settings'),
      text: BACK_TO_ADVANCED_SETTINGS
    },
    navigation,
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    pageCaption: {
      text: pageCaption
    },
    useNewMasthead: true,
    notification,
    notificationDetail,
    errorList: buildErrorList(validation?.formErrors),
    formErrors: validation?.formErrors,
    formValues: values,
    defaultEmail: buildDefaultEmail(metadata, definition),
    conditionsManagerHref: editorv2Path(metadata.slug, 'conditions'),
    outputsTable: {
      head: [
        { text: 'Email address' },
        { text: 'When submissions are sent' },
        { text: 'Format' },
        { text: 'Actions' }
      ],
      rows: outputRows
    },
    isEditing,
    // Only the add form is capped - an existing address can always be amended
    atLimit: !isEditing && outputRows.length >= MAX_ADDITIONAL_EMAILS,
    maxAdditionalEmails: MAX_ADDITIONAL_EMAILS,
    formAction: isEditing
      ? `${editorv2Path(metadata.slug, 'email-actions')}/${editIndex}`
      : editorv2Path(metadata.slug, 'email-actions'),
    cancelHref: editorv2Path(metadata.slug, 'email-actions'),
    addFormHeading: isEditing
      ? 'Change email address'
      : 'Add a new email address',
    buttonText: isEditing ? 'Save changes' : 'Save new email address',
    conditionItems: buildConditionItems(definition, values.condition),
    formatItems: buildFormatItems(values)
  }
}

/**
 * @typedef {object} EmailActionFormValues
 * @property {string} condition - id of the condition, or '' for every submission
 * @property {string} emailAddress - the address submissions are sent to
 * @property {OutputAudience} audience - human or machine readable
 * @property {string} [machineVersion] - version selected for machine-readable output
 */

/**
 * @typedef {object} EmailActionsViewModelOptions
 * @property {number} [editIndex] - index of the output being amended, if any
 * @property {ValidationFailure<EmailActionFormValues>} [validation] - validation failure to replay
 * @property {string} [notification] - success banner heading
 * @property {string} [notificationDetail] - line shown under the success banner heading
 */

/**
 * @import { FormMetadata, FormDefinition, Output, OutputAudience } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
