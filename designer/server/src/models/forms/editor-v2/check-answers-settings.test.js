import {
  buildDefinition,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { getPreviewModel } from '~/src/models/forms/editor-v2/check-answers-settings.js'

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
      const previewModel = getPreviewModel(page, definition, 'http://url', '')
      expect(previewModel.componentRows.rows).toBeInstanceOf(Array)
      expect(previewModel.components).toEqual([])
      expect(previewModel.previewTitle).toBe('Preview of Check answers page')
    })
  })
})
