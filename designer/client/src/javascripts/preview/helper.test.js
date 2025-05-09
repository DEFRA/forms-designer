import { addPathToEditorBaseUrl } from '~/src/javascripts/preview/helper.js'

describe('helper', () => {
  describe('addPathToEditorBaseUrl', () => {
    it('strip current path and add new one', () => {
      const origUrl = 'http://domain.com/some-path/editor-v2/some-extrapath'
      const expectedUrl =
        'http://domain.com/some-path/editor-v2/add-this-path/and-this'
      expect(addPathToEditorBaseUrl(origUrl, '/add-this-path/and-this')).toBe(
        expectedUrl
      )
    })

    it('strip current path and add new one including stateId', () => {
      const origUrl =
        'http://domain.com/some-path/editor-v2/some-extrapath/12345'
      const expectedUrl =
        'http://domain.com/some-path/editor-v2/add-this-path/and-this/12345'
      expect(
        addPathToEditorBaseUrl(origUrl, '/add-this-path/and-this/', true)
      ).toBe(expectedUrl)
    })
  })
})
