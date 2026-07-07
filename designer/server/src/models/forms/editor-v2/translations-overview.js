import { lookupTranslation } from '~/src/models/forms/editor-v2/translations-config.js'

/**
 * @param {string} formNameKey
 * @param {Record<string, string>} translations
 * @param {ValidationFailure<any>} [validation]
 * @returns { string | undefined }
 */
function getTranslation(formNameKey, translations, validation) {
  return (
    validation?.formValues[formNameKey] ??
    lookupTranslation(formNameKey, translations)
  )
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
  const formNameKey = 'metadata.formName'
  const contactEmailAddressKey = 'metadata.contact.email.address'
  const contactEmailResponseKey = 'metadata.contact.email.responseTime'
  const contactOnlineUrlKey = 'metadata.contact.online.url'
  const contactOnlineTextKey = 'metadata.contact.online.text'
  const contactPhoneKey = 'metadata.contact.phone'
  const submissionGuidance = 'metadata.submissionGuidance'

  /**
   * @param {string} formNameKey
   * @param {string} contentType
   * @param { string | undefined } englishReference
   * @param {string} label
   * @param {object} [attributes]
   */
  function buildTableRow(
    formNameKey,
    contentType,
    englishReference,
    label,
    attributes
  ) {
    return {
      name: formNameKey,
      contentType,
      englishContent: englishReference,
      welshContent: getTranslation(formNameKey, translations, validation),
      label,
      attributes
    }
  }

  return [
    {
      title: 'Form name',
      table: [
        buildTableRow(formNameKey, 'Form name', definition.name, 'form name')
      ]
    },
    {
      title: 'Contact details for support: email address and response time',
      table: [
        buildTableRow(
          contactEmailAddressKey,
          'Email address',
          metadata.contact?.email?.address ?? 'Not set',
          'support email address'
        ),
        buildTableRow(
          contactEmailResponseKey,
          'Response time',
          metadata.contact?.email?.responseTime ?? '--',
          'response time message'
        )
      ]
    },
    {
      title: 'Contact link for support',
      table: [
        buildTableRow(
          contactOnlineUrlKey,
          'Contact link',
          metadata.contact?.online?.url ?? 'Not set',
          'contact link URL'
        ),
        buildTableRow(
          contactOnlineTextKey,
          'Link text',
          metadata.contact?.online?.text ?? '--',
          'text for the contact link'
        )
      ]
    },
    {
      title: 'Phone number and opening times',
      table: [
        buildTableRow(
          contactPhoneKey,
          'Phone number and opening times',
          metadata.contact?.phone ?? 'Not set',
          'phone number and opening times',
          { textareaHeight: 5 }
        )
      ]
    },
    {
      title: 'Information about what happens next',
      table: [
        buildTableRow(
          submissionGuidance,
          'What happens next',
          metadata.submissionGuidance ?? 'Not set',
          'information about what happens next',
          { textareaHeight: 5, showMarkdownHelp: true }
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
  const privacyNoticeUrlKey = 'metadata.privacyNoticeUrl'
  const privacyNoticeTextKey = 'metadata.privacyNoticeText'

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
