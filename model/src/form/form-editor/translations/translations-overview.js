import { lookupTranslation } from '~/src/form/form-editor/translations/translations-config.js'

const formNameKey = 'form.title'
const contactEmailAddressKey = 'form.contact.email.address'
const contactEmailResponseKey = 'form.contact.email.responseTime'
const contactOnlineUrlKey = 'form.contact.online.url'
const contactOnlineTextKey = 'form.contact.online.text'
const contactPhoneKey = 'form.contact.phone'
const submissionGuidanceKey = 'form.submissionGuidance'
const privacyNoticeUrlKey = 'form.privacyNoticeUrl'
const privacyNoticeTextKey = 'form.privacyNoticeText'

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
 * @returns {TranslationRow[]}
 */
export function buildOverviewSection(
  metadata,
  definition,
  translations,
  validation
) {
  /** @type {TranslationRow[]} */
  const rows = []

  rows.push(
    {
      name: formNameKey,
      englishContent: definition.name,
      welshContent: getTranslation(formNameKey, translations, validation),
      label: 'Welsh form name'
    },
    {
      name: contactEmailAddressKey,
      englishContent: metadata.contact?.email?.address ?? 'Not set',
      welshContent: getTranslation(
        contactEmailAddressKey,
        translations,
        validation
      ),
      label: 'Welsh support email address'
    },
    {
      name: contactEmailResponseKey,
      englishContent: metadata.contact?.email?.responseTime ?? '--',
      welshContent: getTranslation(
        contactEmailResponseKey,
        translations,
        validation
      ),
      label: 'Welsh response time message'
    },
    {
      name: contactOnlineUrlKey,
      englishContent: metadata.contact?.online?.url ?? 'Not set',
      welshContent: getTranslation(
        contactOnlineUrlKey,
        translations,
        validation
      ),
      label: 'Welsh contact link URL'
    },
    {
      name: contactOnlineTextKey,
      englishContent: metadata.contact?.online?.text ?? '--',
      welshContent: getTranslation(
        contactOnlineTextKey,
        translations,
        validation
      ),
      label: 'Welsh text for the contact link'
    },
    {
      name: contactPhoneKey,
      englishContent: metadata.contact?.phone ?? 'Not set',
      welshContent: getTranslation(contactPhoneKey, translations, validation),
      label: 'Welsh phone number and opening times'
    },
    {
      name: submissionGuidanceKey,
      englishContent: metadata.submissionGuidance ?? 'Not set',
      welshContent: getTranslation(
        submissionGuidanceKey,
        translations,
        validation
      ),
      label: 'Welsh information about what happens next'
    }
  )

  if (metadata.privacyNoticeType === 'link') {
    rows.push({
      name: privacyNoticeUrlKey,
      englishContent: metadata.privacyNoticeUrl ?? 'Not set',
      welshContent: getTranslation(
        privacyNoticeUrlKey,
        translations,
        validation
      ),
      label: 'Welsh privacy notice URL'
    })
  } else {
    rows.push({
      name: privacyNoticeTextKey,
      englishContent: metadata.privacyNoticeText ?? 'Not set',
      welshContent: getTranslation(
        privacyNoticeTextKey,
        translations,
        validation
      ),
      label: 'Welsh privacy notice text'
    })
  }

  return /** @type {TranslationRow[]} */ (rows)
}

/**
 * @import { FormMetadata } from '~/src/form/form-metadata/types.js'
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { TranslationRow, ValidationFailure} from '~/src/form/form-editor/translations/translations-config.js'
 */
