import {
  addPathToEditorBaseUrl,
  hideHtmlElement,
  showHtmlElement
} from '~/src/javascripts/preview/helper.js'

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

    it('strip current path and add new one when no leading slash', () => {
      const origUrl = 'http://domain.com/some-path/editor-v2/some-extrapath'
      const expectedUrl =
        'http://domain.com/some-path/editor-v2/add-this-path/and-this'
      expect(addPathToEditorBaseUrl(origUrl, 'add-this-path/and-this')).toBe(
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

    it('strip current path and add new one including stateId with no leading slash', () => {
      const origUrl =
        'http://domain.com/some-path/editor-v2/some-extrapath/12345'
      const expectedUrl =
        'http://domain.com/some-path/editor-v2/add-this-path/and-this/12345'
      expect(
        addPathToEditorBaseUrl(origUrl, 'add-this-path/and-this/', true)
      ).toBe(expectedUrl)
    })
  })

  describe('showHideHtmlElement', () => {
    it('should show element if exists', () => {
      document.body.innerHTML = '<div id="test-element">some text</div>'
      const elem = document.getElementById('test-element')
      showHtmlElement(elem)
      expect(elem?.style.display).toBe('block')
    })

    it('should ignore if element not exists', () => {
      document.body.innerHTML = '<div id="test-element">some text</div>'
      const elem = document.getElementById('test-element-missing')
      showHtmlElement(elem)
      expect(elem).toBeNull()
    })

    it('should hide element if exists', () => {
      document.body.innerHTML = '<div id="test-element">some text</div>'
      const elem = document.getElementById('test-element')
      hideHtmlElement(elem)
      expect(elem?.style.display).toBe('none')
    })

    it('should ignore if element not exists, for hide', () => {
      document.body.innerHTML = '<div id="test-element">some text</div>'
      const elem = document.getElementById('test-element-missing')
      hideHtmlElement(elem)
      expect(elem).toBeNull()
    })
  })
})
