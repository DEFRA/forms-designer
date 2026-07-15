import { testFormDefinitionWithRadioQuestionAndList } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { translationsViewModel } from '~/src/models/forms/editor-v2/translations.js'

describe('Translations', () => {
  describe('translationsViewModel', () => {
    it('should return view model', () => {
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

      const definition = {
        ...testFormDefinitionWithRadioQuestionAndList,
        name: 'my form name'
      }

      const res = translationsViewModel(populatedMetadata, definition)

      expect(res.backLink).toEqual({
        href: '/library/my-form-slug/editor-v2/pages',
        text: 'Back to add and edit pages'
      })
      expect(res.rowViewModel.overviewRows).toHaveLength(6)
      expect(res.rowViewModel.overviewRows[0]).toEqual({
        caption: 'Form name',
        rowData: [
          {
            title: 'Form name',
            row: {
              englishContent: 'my form name',
              label: 'Welsh form name',
              name: 'form.title',
              welshContent: ''
            },
            error: false,
            type: undefined
          }
        ]
      })
      expect(res.rowViewModel.formRows).toHaveLength(5)
      expect(res.rowViewModel.formRows[0]).toEqual({
        caption: 'Page 1'
      })
      expect(res.rowViewModel.formRows[1]).toEqual({
        rowData: [
          {
            title: 'Page heading',
            row: {
              englishContent: 'Radio question',
              label: 'Welsh page heading - page 1',
              name: 'pages.p1.title',
              welshContent: '',
              pageNum: 1,
              type: 'PageHeading'
            },
            type: undefined
          }
        ]
      })
    })
  })
})
