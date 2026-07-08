import { lookupTranslation } from '~/src/models/forms/editor-v2/translations-config.js'

const formNameKey = 'metadata.title'
const contactEmailAddressKey = 'metadata.contact.email.address'
const contactEmailResponseKey = 'metadata.contact.email.responseTime'
const contactOnlineUrlKey = 'metadata.contact.online.url'
const contactOnlineTextKey = 'metadata.contact.online.text'
const contactPhoneKey = 'metadata.contact.phone'
const submissionGuidanceKey = 'metadata.submissionGuidance'
const privacyNoticeUrlKey = 'metadata.privacyNoticeUrl'
const privacyNoticeTextKey = 'metadata.privacyNoticeText'

const fieldConfig =
  /** @type {Record<string, { contentType: string, label: string, attributes?: object }>} */ ({
    [formNameKey]: {
      contentType: 'Form name',
      label: 'form name'
    },
    [contactEmailAddressKey]: {
      contentType: 'Email address',
      label: 'support email address'
    },
    [contactEmailResponseKey]: {
      contentType: 'Response time',
      label: 'response time message'
    },
    [contactOnlineUrlKey]: {
      contentType: 'Contact link',
      label: 'contact link URL'
    },
    [contactOnlineTextKey]: {
      contentType: 'Link text',
      label: 'text for the contact link'
    },
    [contactPhoneKey]: {
      contentType: 'Phone number and opening times',
      label: 'phone number and opening times',
      attributes: { textareaHeight: 5 }
    },
    [submissionGuidanceKey]: {
      contentType: 'What happens next',
      label: 'information about what happens next',
      attributes: { textareaHeight: 5, showMarkdownHelp: true }
    }
  })

/**
 * @param {string} key
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns { string | undefined }
 */
function getTranslation(key, translations, validation) {
  return validation?.formValues[key] ?? lookupTranslation(key, translations)
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns {{ title: string, table: Translation[]}[]}
 */
export function buildOverviewSection(
  metadata,
  definition,
  translations,
  validation
) {
  /**
   * @param {string} name
   * @param { string | undefined } englishReference
   */
  function buildTableRow(name, englishReference) {
    const field = fieldConfig[name]
    return {
      name,
      contentType: field.contentType,
      englishContent: englishReference,
      welshContent: getTranslation(name, translations, validation),
      label: field.label,
      attributes: field.attributes
    }
  }

  return [
    {
      title: 'Form name',
      table: [buildTableRow(formNameKey, definition.name)]
    },
    {
      title: 'Contact details for support: email address and response time',
      table: [
        buildTableRow(
          contactEmailAddressKey,
          metadata.contact?.email?.address ?? 'Not set'
        ),
        buildTableRow(
          contactEmailResponseKey,
          metadata.contact?.email?.responseTime ?? '--'
        )
      ]
    },
    {
      title: 'Contact link for support',
      table: [
        buildTableRow(
          contactOnlineUrlKey,
          metadata.contact?.online?.url ?? 'Not set'
        ),
        buildTableRow(
          contactOnlineTextKey,
          metadata.contact?.online?.text ?? '--'
        )
      ]
    },
    {
      title: 'Phone number and opening times',
      table: [
        buildTableRow(contactPhoneKey, metadata.contact?.phone ?? 'Not set')
      ]
    },
    {
      title: 'Information about what happens next',
      table: [
        buildTableRow(
          submissionGuidanceKey,
          metadata.submissionGuidance ?? 'Not set'
        )
      ]
    },
    buildPrivacyNoticeSection(metadata, translations, validation)
  ]
}

/**
 * @param {FormMetadata} metadata
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns {{ title: string, table: Translation[]}}
 */
export function buildPrivacyNoticeSection(metadata, translations, validation) {
  if (metadata.privacyNoticeType === 'url') {
    return {
      title: 'Privacy information for this form (uses a link)',
      table: [
        {
          name: privacyNoticeUrlKey,
          contentType: 'Privacy notice link',
          englishContent: metadata.privacyNoticeUrl ?? 'Not set',
          welshContent: getTranslation(
            privacyNoticeUrlKey,
            translations,
            validation
          ),
          label: 'privacy notice URL'
        }
      ]
    }
  }

  return {
    title: 'Privacy information for this form (uses inline content)',
    table: [
      {
        name: privacyNoticeTextKey,
        contentType: 'Privacy notice content',
        englishContent: metadata.privacyNoticeText ?? 'Not set',
        welshContent: getTranslation(
          privacyNoticeTextKey,
          translations,
          validation
        ),
        label: 'privacy notice content',
        attributes: { textareaHeight: 5, showMarkdownHelp: true }
      }
    ]
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 * @import { Translation } from '~/src/models/forms/editor-v2/translations-config.js'
 */
