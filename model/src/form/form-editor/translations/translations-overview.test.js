import { buildOverviewSection } from '~/src/form/form-editor/translations/translations-overview.js'
import { buildDefinition, buildMetaData } from '~/src/stubs.js'

const definition = {
  ...buildDefinition(),
  name: 'my form name'
}

const testFormMetadata = buildMetaData()

const populatedMetadata = {
  ...buildMetaData(),
  contact: {
    phone: '0123456789',
    email: {
      address: 'my-email@server.com',
      responseTime: 'Response is 2 days'
    },
    online: {
      url: 'https://contact-link.com',
      text: 'My link text'
    }
  },
  submissionGuidance: 'My submission guidance text',
  privacyNoticeType: 'text',
  privacyNoticeText: 'Privacy notice text'
}

describe('Translations overview', () => {
  describe('buildOverviewSection', () => {
    it('should return overview based on metadata values (no translations yet, and mostly unpopulated values)', () => {
      const translations = { dummy: 'abc' }
      const validation = undefined
      const res = buildOverviewSection(
        testFormMetadata,
        definition,
        translations,
        validation
      )
      expect(res).toEqual([
        {
          name: 'form.title',
          englishContent: 'my form name',
          welshContent: '',
          label: 'Welsh form name'
        },
        {
          name: 'form.contact.email.address',
          englishContent: 'Not set',
          welshContent: '',
          label: 'Welsh support email address'
        },
        {
          name: 'form.contact.email.responseTime',
          englishContent: '--',
          welshContent: '',
          label: 'Welsh response time message'
        },
        {
          name: 'form.contact.online.url',
          englishContent: 'Not set',
          welshContent: '',
          label: 'Welsh contact link URL'
        },
        {
          name: 'form.contact.online.text',
          englishContent: '--',
          welshContent: '',
          label: 'Welsh text for the contact link'
        },
        {
          name: 'form.contact.phone',
          englishContent: 'Not set',
          welshContent: '',
          label: 'Welsh phone number and opening times'
        },
        {
          name: 'form.submissionGuidance',
          englishContent: 'Not set',
          welshContent: '',
          label: 'Welsh information about what happens next'
        },
        {
          name: 'form.privacyNoticeText',
          englishContent: 'Not set',
          welshContent: '',
          label: 'Welsh privacy notice text'
        }
      ])
    })

    it('should return overview based on metadata values (no translations yet, but most values present)', () => {
      const translations = { dummy: 'abc' }
      const validation = undefined
      const res = buildOverviewSection(
        populatedMetadata,
        definition,
        translations,
        validation
      )
      expect(res[0].englishContent).toBe('my form name')
      expect(res[1].englishContent).toBe('my-email@server.com')
      expect(res[2].englishContent).toBe('Response is 2 days')
      expect(res[3].englishContent).toBe('https://contact-link.com')
      expect(res[4].englishContent).toBe('My link text')
      expect(res[5].englishContent).toBe('0123456789')
      expect(res[6].englishContent).toBe('My submission guidance text')
      expect(res[7].englishContent).toBe('Privacy notice text')
    })

    it('should return overview based on translations of metadata (where they exist)', () => {
      const translations = /** @type {Record<string, string>} */ ({
        'form.title': 'new form name',
        'form.contact.email.address': 'new@server.com',
        'form.contact.email.responseTime': 'New response time',
        'form.contact.online.url': 'https://new-online.com',
        'form.contact.online.text': 'new online text',
        'form.contact.phone': '0111222333',
        'form.submissionGuidance': 'new submission guidance'
      })
      const validation = undefined
      const res = buildOverviewSection(
        populatedMetadata,
        definition,
        translations,
        validation
      )
      expect(res[0].welshContent).toBe('new form name')
      expect(res[1].welshContent).toBe('new@server.com')
      expect(res[2].welshContent).toBe('New response time')
      expect(res[3].welshContent).toBe('https://new-online.com')
      expect(res[4].welshContent).toBe('new online text')
      expect(res[5].welshContent).toBe('0111222333')
      expect(res[6].welshContent).toBe('new submission guidance')
      expect(res[7].welshContent).toBe('')
    })

    it('should return overview based on translations and posted values', () => {
      const translations = /** @type {Record<string, string>} */ ({
        'form.title': 'new form name',
        'form.contact.email.address': 'new@server.com',
        'form.contact.phone': '0111222333',
        'form.submissionGuidance': 'new submission guidance'
      })
      const validation = /** @type {ValidationFailure<any>} */ ({
        formValues: {
          'form.contact.email.responseTime': 'Validation response time',
          'form.contact.online.url': 'https://validation.com',
          'form.contact.online.text': ''
        }
      })
      const res = buildOverviewSection(
        populatedMetadata,
        definition,
        translations,
        validation
      )
      expect(res[0].welshContent).toBe('new form name')
      expect(res[1].welshContent).toBe('new@server.com')
      expect(res[2].welshContent).toBe('Validation response time')
      expect(res[3].welshContent).toBe('https://validation.com')
      expect(res[4].welshContent).toBe('')
      expect(res[5].welshContent).toBe('0111222333')
      expect(res[6].welshContent).toBe('new submission guidance')
      expect(res[7].welshContent).toBe('')
    })

    it('should return overview with alternate privacy notice', () => {
      const translations = /** @type {Record<string, string>} */ ({
        'form.title': 'new form name',
        'form.contact.email.address': 'new@server.com',
        'form.contact.phone': '0111222333',
        'form.submissionGuidance': 'new submission guidance'
      })
      const validation = undefined
      const metadata = structuredClone(testFormMetadata)
      metadata.privacyNoticeText = undefined
      metadata.privacyNoticeType = 'link'
      metadata.privacyNoticeUrl = 'http://my-privacy-link'

      const res = buildOverviewSection(
        metadata,
        definition,
        translations,
        validation
      )
      expect(res[0]).toEqual({
        name: 'form.title',
        englishContent: 'my form name',
        welshContent: 'new form name',
        label: 'Welsh form name'
      })
      expect(res[7]).toEqual({
        name: 'form.privacyNoticeUrl',
        englishContent: 'http://my-privacy-link',
        welshContent: '',
        label: 'Welsh privacy notice URL'
      })
    })
  })
})

/**
 * @import { ValidationFailure } from '~/src/form/form-editor/translations/translations-config.js'
 */
