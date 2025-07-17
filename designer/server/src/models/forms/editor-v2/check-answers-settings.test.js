import {
  buildDefinition,
  buildMarkdownComponent,
  buildMetaData,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  checkAnswersSettingsViewModel,
  getPreviewModel,
  settingsFields
} from '~/src/models/forms/editor-v2/check-answers-settings.js'

describe('check answers settings', () => {
  describe('getPreviewModel', () => {
    it('should create the model', () => {
      const page = buildSummaryPage()
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            components: [
              buildTextFieldComponent({
                shortDescription: 'Your name'
              })
            ]
          })
        ]
      })
      const fields = settingsFields('false', '')
      const previewModel = getPreviewModel(
        page,
        definition,
        'http://url',
        fields
      )
      expect(previewModel.componentRows.rows).toBeInstanceOf(Array)
      expect(previewModel.components).toEqual([])
      expect(previewModel.previewTitle).toBe('Preview of Check answers page')
    })

    it('should strip html tags from the preview JSON', () => {
      const page = buildSummaryPage()
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            components: [
              buildTextFieldComponent({
                shortDescription: "Your name <script>alert('xss')</script>"
              })
            ]
          })
        ]
      })
      const fields = settingsFields('false', '')
      const previewModel = getPreviewModel(
        page,
        definition,
        'http://url',
        fields
      )
      expect(previewModel.componentRows.rows[0].key).toEqual({
        text: "Your name alert('xss')"
      })
    })
  })
  describe('checkAnswersSettingsViewModel', () => {
    it('should remove html tags', () => {
      const metadata = buildMetaData()
      const pageId = 'ee54ead5-3dcb-4066-a13c-b1cd3562ae0b'
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: pageId,
            components: [
              buildMarkdownComponent({
                content: "<script>alert('xss')</script>"
              })
            ]
          })
        ]
      })

      const model = checkAnswersSettingsViewModel(
        metadata,
        definition,
        pageId,
        undefined,
        []
      )

      expect(model.preview.definition).toBe(
        '{"name":"Test form","pages":[{"id":"ee54ead5-3dcb-4066-a13c-b1cd3562ae0b","title":"Summary page","components":[{"id":"4a2dc88c-be1a-4277-aff8-04220de2e778","title":"Markdown Component","name":"MarkdownComponent","options":{},"content":"alert(\'xss\')","type":"Markdown"}],"path":"/summary","controller":"SummaryPageController"}],"conditions":[],"sections":[],"lists":[]}'
      )
    })
  })
})
