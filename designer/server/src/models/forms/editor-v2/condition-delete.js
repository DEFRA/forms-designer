import { getConditionV2 } from '@defra/forms-model'

import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import { findConditionReferences } from '~/src/lib/condition-references.js'
import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { editorFormPath, formOverviewPath } from '~/src/models/links.js'

export const REFERENCES_WARNING_TEXT = 'Deleting this condition will affect:'
export const BLOCKED_HEADING_TEXT = 'You cannot delete this condition'
export const BLOCKERS_INTRO_TEXT = 'This condition is currently used by:'

export const PAYMENT_REFERENCE_MESSAGE =
  'This condition cannot be deleted because it is used for a conditional payment amount. Remove the conditional payment amount that uses it before deleting it.'
export const CONDITION_REFERENCE_MESSAGE =
  'This condition cannot be deleted because it is referenced by other conditions. Remove all references to this condition before deleting it.'
export const PAYMENT_AND_CONDITIONAL_REFERENCE_MESSAGE =
  'This condition cannot be deleted because it is used for a conditional payment amount and referenced by other conditions. Remove the conditional payment amount and all references to this condition before deleting it.'

/**
 * Why this condition cannot be deleted, or undefined when nothing blocks it.
 * Pages and email actions are not blockers - they are updated or deleted with
 * the condition - but a conditional payment amount or another condition
 * referencing it has to be dealt with by the author first.
 * @param {ReturnType<typeof findConditionReferences>} references
 */
export function getDeletionBlockedMessage({ paymentFields, conditions }) {
  const hasPaymentReferences = paymentFields.length > 0
  const hasConditionReferences = conditions.length > 0

  if (hasPaymentReferences && hasConditionReferences) {
    return PAYMENT_AND_CONDITIONAL_REFERENCE_MESSAGE
  }

  if (hasPaymentReferences) {
    return PAYMENT_REFERENCE_MESSAGE
  }

  if (hasConditionReferences) {
    return CONDITION_REFERENCE_MESSAGE
  }

  return undefined
}

/**
 * The email action format, worded to sit inside the brackets of a list item -
 * the email actions page wording nests its own brackets, which would double up
 * here.
 * @param {OutputAudience} audience
 * @param {string} version
 */
export function formatOutputDescription(audience, version) {
  return audience === 'machine'
    ? `Machine-readable - version ${version}`
    : 'Human-readable'
}

/**
 * @param {ReturnType<typeof getFormSpecificNavigation>} navigation
 * @param {{ slug: string, pageTitle: string, pageHeading: string, formTitle: string }} fields
 * @param {string} blockedMessage
 * @param {string[]} blockerItems
 * @param {string} conditionsListHref
 */
function blockedViewModel(
  navigation,
  { slug, pageTitle, pageHeading, formTitle },
  blockedMessage,
  blockerItems,
  conditionsListHref
) {
  return {
    ...baseModelFields(slug, pageTitle, pageHeading, formTitle),
    navigation,
    bodyHeadingText: BLOCKED_HEADING_TEXT,
    errorList: buildSimpleErrorList([blockedMessage]),
    bodyWarning: blockerItems.length
      ? {
          html: `${BLOCKERS_INTRO_TEXT}<ul class="govuk-list govuk-list--bullet">
      ${blockerItems.join('')}
    </ul>`
        }
      : null,
    buttons: [
      {
        href: conditionsListHref,
        text: 'Back to conditions',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @param {ReturnType<typeof getFormSpecificNavigation>} navigation
 * @param {{ slug: string, pageTitle: string, pageHeading: string, formTitle: string }} fields
 * @param {string} bodyHeadingText
 * @param {string[]} affectedItems
 * @param {string} conditionsListHref
 */
function pageViewModel(
  navigation,
  { slug, pageTitle, pageHeading, formTitle },
  bodyHeadingText,
  affectedItems,
  conditionsListHref
) {
  return {
    ...baseModelFields(slug, pageTitle, pageHeading, formTitle),
    navigation,
    bodyHeadingText,
    errorList: [],
    bodyWarning: affectedItems.length
      ? {
          html: `${REFERENCES_WARNING_TEXT}<ul class="govuk-list govuk-list--bullet">
        ${affectedItems.join('')}
      </ul>`
        }
      : null,
    buttons: [
      {
        text: 'Delete condition',
        classes: 'govuk-button--warning'
      },
      {
        href: conditionsListHref,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * Model to represent delete condition confirmation page
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @param {string} [blockedMessageOverride] - reason the delete was refused elsewhere, eg by forms-manager
 */
export function deleteConditionConfirmationPageViewModel(
  metadata,
  definition,
  conditionId,
  blockedMessageOverride
) {
  const formTitle = metadata.title
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const condition = getConditionV2(definition, conditionId)
  const references = findConditionReferences(definition, conditionId)
  const { pages, conditions, paymentFields, outputs } = references

  const blockedMessage =
    blockedMessageOverride ?? getDeletionBlockedMessage(references)

  const bodyHeadingText = 'Are you sure you want to delete this condition?'
  const pageHeading = `Delete condition: ${condition.displayName}`
  const pageTitle = `${pageHeading} - ${formTitle}`
  const conditionsListHref = editorFormPath(metadata.slug, 'conditions')

  // Nothing here can be deleted, so the page states why and offers no way to
  // try - the author has to remove the payment amount or the other conditions
  // first
  if (blockedMessage) {
    const blockedPageNumbers = [
      ...new Set(paymentFields.map((field) => field.pageNumber))
    ].sort((numA, numB) => numA - numB)

    const blockerItems = [
      ...blockedPageNumbers.map(
        (pageNumber) =>
          `<li>Conditional payment amount on page ${pageNumber}</li>`
      ),
      ...conditions.map(
        (reference) => `<li>Condition: ${reference.conditionName}</li>`
      )
    ]

    return blockedViewModel(
      navigation,
      { slug: metadata.slug, pageTitle, pageHeading, formTitle },
      blockedMessage,
      blockerItems,
      conditionsListHref
    )
  }

  // Payment and condition references are blockers handled above, so the pages
  // left are those the condition controls the display of. Email actions cannot
  // outlive the condition that drives them, so they go with it - both are
  // listed together so the author sees everything the delete touches.
  const affectedItems = [
    ...pages.map((page) => `<li>Page ${page.pageNumber}</li>`),
    ...outputs.map(
      (output) =>
        `<li>Emails sent to ${output.emailAddress} (${formatOutputDescription(output.audience, output.version)}) - this output will be deleted</li>`
    )
  ]

  return pageViewModel(
    navigation,
    { slug: metadata.slug, pageTitle, pageHeading, formTitle },
    bodyHeadingText,
    affectedItems,
    conditionsListHref
  )
}

/**
 * @import { FormMetadata, FormDefinition, OutputAudience } from '@defra/forms-model'
 */
