import { buildDefinition, buildQuestionPage } from '@defra/forms-model/stubs'

import { getPageAndDefinition } from '~/src/javascripts/preview/page-controller/get-page-details.js'

describe('get-page-details', () => {
  const formId = '54ad568c-28ee-4276-b52b-63ed5309c30b'
  const pageId = '2c35bb7f-c2d1-4e7f-a753-a38a78d9b1d1'
  const page = buildQuestionPage({
    id: pageId
  })
  const formDefinition = buildDefinition({
    pages: [page]
  })
  window.fetch = jest.fn(() =>
    Promise.resolve(
      /** @type {Response} */ ({
        json: () => Promise.resolve(formDefinition)
      })
    )
  )
  describe('getPageAndDefinition', () => {
    it('should get page and declaration', async () => {
      const pageAndDeclaration = await getPageAndDefinition(formId, pageId)

      expect(pageAndDeclaration).toEqual({
        page,
        definition: formDefinition
      })
    })

    it('should get declaration if no pageId exists', async () => {
      const pageAndDeclaration = await getPageAndDefinition(formId, undefined)

      expect(pageAndDeclaration).toEqual({
        page: undefined,
        definition: formDefinition
      })
    })
  })
})
