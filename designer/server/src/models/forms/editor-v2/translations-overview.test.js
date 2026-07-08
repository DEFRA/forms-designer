import { testFormDefinitionWithNoPages } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import {
  buildOverviewSection,
  buildPrivacyNoticeSection
} from '~/src/models/forms/editor-v2/translations-overview.js'

const definition = {
  ...testFormDefinitionWithNoPages,
  name: 'my form name'
}

const populatedMetadata = {
  ...testFormMetadata,
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
          table: [
            {
              contentType: 'Form name',
              englishContent: 'my form name',
              label: 'form name',
              name: 'metadata.title',
              welshContent: ''
            }
          ],
          title: 'Form name'
        },
        {
          table: [
            {
              contentType: 'Email address',
              englishContent: 'Not set',
              label: 'support email address',
              name: 'metadata.contact.email.address',
              welshContent: ''
            },
            {
              contentType: 'Response time',
              englishContent: '--',
              label: 'response time message',
              name: 'metadata.contact.email.responseTime',
              welshContent: ''
            }
          ],
          title: 'Contact details for support: email address and response time'
        },
        {
          table: [
            {
              contentType: 'Contact link',
              englishContent: 'Not set',
              label: 'contact link URL',
              name: 'metadata.contact.online.url',
              welshContent: ''
            },
            {
              contentType: 'Link text',
              englishContent: '--',
              label: 'text for the contact link',
              name: 'metadata.contact.online.text',
              welshContent: ''
            }
          ],
          title: 'Contact link for support'
        },
        {
          table: [
            {
              attributes: { textareaHeight: 5 },
              contentType: 'Phone number and opening times',
              englishContent: 'Not set',
              label: 'phone number and opening times',
              name: 'metadata.contact.phone',
              welshContent: ''
            }
          ],
          title: 'Phone number and opening times'
        },
        {
          table: [
            {
              attributes: { showMarkdownHelp: true, textareaHeight: 5 },
              contentType: 'What happens next',
              englishContent: 'Not set',
              label: 'information about what happens next',
              name: 'metadata.submissionGuidance',
              welshContent: ''
            }
          ],
          title: 'Information about what happens next'
        },
        {
          table: [
            {
              attributes: { showMarkdownHelp: true, textareaHeight: 5 },
              contentType: 'Privacy notice content',
              englishContent: 'Not set',
              label: 'privacy notice content',
              name: 'metadata.privacyNoticeText',
              welshContent: ''
            }
          ],
          title: 'Privacy information for this form (uses inline content)'
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
      expect(res[0].table[0].englishContent).toBe('my form name')
      expect(res[1].table[0].englishContent).toBe('my-email@server.com')
      expect(res[1].table[1].englishContent).toBe('Response is 2 days')
      expect(res[2].table[0].englishContent).toBe('https://contact-link.com')
      expect(res[2].table[1].englishContent).toBe('My link text')
      expect(res[3].table[0].englishContent).toBe('0123456789')
      expect(res[4].table[0].englishContent).toBe('My submission guidance text')
      expect(res[5].table[0].englishContent).toBe('Privacy notice text')
    })

    it('should return overview based on translations of metadata (where they exist)', () => {
      const translations = /** @type {Record<string, string>} */ ({
        'metadata.title': 'new form name',
        'metadata.contact.email.address': 'new@server.com',
        'metadata.contact.email.responseTime': 'New response time',
        'metadata.contact.online.url': 'https://new-online.com',
        'metadata.contact.online.text': 'new online text',
        'metadata.contact.phone': '0111222333',
        'metadata.submissionGuidance': 'new submission guidance'
      })
      const validation = undefined
      const res = buildOverviewSection(
        populatedMetadata,
        definition,
        translations,
        validation
      )
      expect(res[0].table[0].welshContent).toBe('new form name')
      expect(res[1].table[0].welshContent).toBe('new@server.com')
      expect(res[1].table[1].welshContent).toBe('New response time')
      expect(res[2].table[0].welshContent).toBe('https://new-online.com')
      expect(res[2].table[1].welshContent).toBe('new online text')
      expect(res[3].table[0].welshContent).toBe('0111222333')
      expect(res[4].table[0].welshContent).toBe('new submission guidance')
      expect(res[5].table[0].welshContent).toBe('')
    })

    it('should return overview based on translations and posted values', () => {
      const translations = /** @type {Record<string, string>} */ ({
        'metadata.title': 'new form name',
        'metadata.contact.email.address': 'new@server.com',
        'metadata.contact.phone': '0111222333',
        'metadata.submissionGuidance': 'new submission guidance'
      })
      const validation = /** @type {ValidationFailure<any>} */ ({
        formValues: {
          'metadata.contact.email.responseTime': 'Validation response time',
          'metadata.contact.online.url': 'https://validation.com',
          'metadata.contact.online.text': ''
        }
      })
      const res = buildOverviewSection(
        populatedMetadata,
        definition,
        translations,
        validation
      )
      expect(res[0].table[0].welshContent).toBe('new form name')
      expect(res[1].table[0].welshContent).toBe('new@server.com')
      expect(res[1].table[1].welshContent).toBe('Validation response time')
      expect(res[2].table[0].welshContent).toBe('https://validation.com')
      expect(res[2].table[1].welshContent).toBe('')
      expect(res[3].table[0].welshContent).toBe('0111222333')
      expect(res[4].table[0].welshContent).toBe('new submission guidance')
      expect(res[5].table[0].welshContent).toBe('')
    })
  })

  describe('buildPrivacyNoticeSection', () => {
    it('should return privacy notice url info', () => {
      const pnMetadata = {
        ...populatedMetadata,
        privacyNoticeType: 'url',
        privacyNoticeUrl: 'https:/privacy-notice.com'
      }
      const translations = /** @type {Record<string, string>} */ ({
        'metadata.privacyNoticeUrl': 'https:/privacy-notice2.com'
      })
      const validation = /** @type {ValidationFailure<any>} */ ({
        formValues: {}
      })
      const res = buildPrivacyNoticeSection(
        pnMetadata,
        translations,
        validation
      )
      expect(res.table[0].englishContent).toBe('https:/privacy-notice.com')
      expect(res.table[0].welshContent).toBe('https:/privacy-notice2.com')
    })

    it('should return privacy notice content info', () => {
      const pnMetadata = {
        ...populatedMetadata,
        privacyNoticeType: 'text',
        privacyNoticeText: 'Privacy notice text content'
      }
      const translations = /** @type {Record<string, string>} */ ({
        'metadata.privacyNoticeText': 'Changed privacy notice text'
      })
      const validation = /** @type {ValidationFailure<any>} */ ({
        formValues: {}
      })
      const res = buildPrivacyNoticeSection(
        pnMetadata,
        translations,
        validation
      )
      expect(res.table[0].englishContent).toBe('Privacy notice text content')
      expect(res.table[0].welshContent).toBe('Changed privacy notice text')
    })
  })
})

/**
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
