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

  return [
    {
      title: 'Form name',
      table: [
        {
          name: formNameKey,
          contentType: 'Form name',
          englishContent: definition.name,
          welshContent: getTranslation(formNameKey, translations, validation),
          label: 'form name'
        }
      ]
    },
    {
      title: 'Contact details for support: email address and response time',
      table: [
        {
          name: contactEmailAddressKey,
          contentType: 'Email address',
          englishContent: metadata.contact?.email?.address ?? 'Not set',
          welshContent: getTranslation(
            contactEmailAddressKey,
            translations,
            validation
          ),
          label: 'support email address'
        },
        {
          name: contactEmailResponseKey,
          contentType: 'Response time',
          englishContent: metadata.contact?.email?.responseTime ?? '--',
          welshContent: getTranslation(
            contactEmailResponseKey,
            translations,
            validation
          ),
          label: 'response time message'
        }
      ]
    },
    {
      title: 'Contact link for support',
      table: [
        {
          name: contactOnlineUrlKey,
          contentType: 'Contact link',
          englishContent: metadata.contact?.online?.url ?? 'Not set',
          welshContent: getTranslation(
            contactOnlineUrlKey,
            translations,
            validation
          ),
          label: 'contact link URL'
        },
        {
          name: contactOnlineTextKey,
          contentType: 'Link text',
          englishContent: metadata.contact?.online?.text ?? '--',
          welshContent: getTranslation(
            contactOnlineTextKey,
            translations,
            validation
          ),
          label: 'text for the contact link'
        }
      ]
    },
    {
      title: 'Phone number and opening times',
      table: [
        {
          name: contactPhoneKey,
          contentType: 'Phone number and opening times',
          englishContent: metadata.contact?.phone ?? 'Not set',
          welshContent: getTranslation(
            contactPhoneKey,
            translations,
            validation
          ),
          label: 'phone number and opening times',
          attributes: { textareaHeight: 5 }
        }
      ]
    },
    {
      title: 'Information about what happens next',
      table: [
        {
          name: submissionGuidance,
          contentType: 'What happens next',
          englishContent: metadata.submissionGuidance ?? 'Not set',
          welshContent: getTranslation(
            submissionGuidance,
            translations,
            validation
          ),
          label: 'information about what happens next',
          attributes: { textareaHeight: 5, showMarkdownHelp: true }
        }
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
