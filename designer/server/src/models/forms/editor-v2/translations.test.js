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

      const res = translationsViewModel(
        populatedMetadata,
        definition,
        '<p>markdown html</p>'
      )

      expect(res.backLink).toEqual({
        href: '/library/my-form-slug/editor-v2/pages',
        text: 'Back to add and edit pages'
      })
      expect(res.fieldTables).toHaveLength(9)
      expect(res.fieldTables[0]).toEqual({
        caption: 'Form name',
        captionClasses: 'govuk-table__caption--m',
        classes: 'govuk-!-margin-bottom-0 app-translation-table',
        firstCellIsHeader: false,
        head: [
          {
            classes: 'app-translation-table__empty-header-cell',
            html: '<span class="govuk-visually-hidden">Field type</span>'
          },
          { text: 'English content' },
          { text: 'Welsh content' }
        ],
        rows: [
          [
            { classes: 'govuk-table__header', text: 'Form name' },
            { classes: 'govuk-!-text-break-word', html: 'my form name' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="form.title">Welsh form name</label><input type="text" lang="cy" class="govuk-input" name="form.title" id="form.title" value=""/></div'
            }
          ]
        ]
      })
      expect(res.fieldTables[7]).toEqual({
        caption: 'Page 1',
        captionClasses: 'govuk-table__caption--m',
        classes: 'govuk-!-margin-bottom-0 app-translation-table',
        firstCellIsHeader: false,
        head: [
          {
            classes: 'app-translation-table__empty-header-cell',
            html: '<span class="govuk-visually-hidden">Field type</span>'
          },
          { text: 'English content' },
          { text: 'Welsh content' }
        ],
        rows: [
          [
            { classes: 'govuk-table__header', text: 'Page heading' },
            { classes: 'govuk-!-text-break-word', html: 'Radio question' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="pages.p1.title">Welsh page heading - page 1</label><input type="text" lang="cy" class="govuk-input" name="pages.p1.title" id="pages.p1.title" value=""/></div'
            }
          ]
        ]
      })
      expect(res.fieldTables[8]).toEqual({
        caption: 'Page 1, question 1',
        captionClasses: 'govuk-table__caption--m',
        classes: 'govuk-!-margin-bottom-0 app-translation-table',
        firstCellIsHeader: false,
        head: [
          {
            classes: 'app-translation-table__empty-header-cell',
            html: '<span class="govuk-visually-hidden">Field type</span>'
          },
          { text: 'English content' },
          { text: 'Welsh content' }
        ],
        rows: [
          [
            { classes: 'govuk-table__header', text: 'Question text' },
            { classes: 'govuk-!-text-break-word', html: 'Select a colour' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="components.q1.title">Welsh question text - page 1, question 1</label><input type="text" lang="cy" class="govuk-input" name="components.q1.title" id="components.q1.title" value=""/></div'
            }
          ],
          [
            { classes: 'govuk-table__header', text: 'Short description' },
            { classes: 'govuk-!-text-break-word', html: '' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="components.q1.shortDescription">Welsh short description - page 1, question 1</label><input type="text" lang="cy" class="govuk-input" name="components.q1.shortDescription" id="components.q1.shortDescription" value=""/></div'
            }
          ],
          [
            { classes: 'govuk-table__header', text: 'Option 1' },
            { classes: 'govuk-!-text-break-word', html: 'Blue' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="listItems.undefined.text">Welsh option 1 - page 1, question 1</label><input type="text" lang="cy" class="govuk-input" name="listItems.undefined.text" id="listItems.undefined.text" value=""/></div'
            }
          ],
          [
            { classes: 'govuk-table__header', text: 'Option 2' },
            { classes: 'govuk-!-text-break-word', html: 'Red' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="listItems.undefined.text">Welsh option 2 - page 1, question 1</label><input type="text" lang="cy" class="govuk-input" name="listItems.undefined.text" id="listItems.undefined.text" value=""/></div'
            }
          ],
          [
            { classes: 'govuk-table__header', text: 'Option 3' },
            { classes: 'govuk-!-text-break-word', html: 'Green' },
            {
              classes: '',
              html: '<div class="govuk-form-group"><label class="govuk-label govuk-visually-hidden" for="listItems.undefined.text">Welsh option 3 - page 1, question 1</label><input type="text" lang="cy" class="govuk-input" name="listItems.undefined.text" id="listItems.undefined.text" value=""/></div'
            }
          ]
        ]
      })
    })
  })
})
