import { CheckboxesField } from '~/src/javascripts/editor-v2-classes/checkboxesfield.js'

describe('CheckboxesField class', () => {
  const checkboxesField = new CheckboxesField(document)
  describe('initialisation', () => {
    test('should create class', () => {
      expect(checkboxesField).toBeDefined()
    })

    test('should getInitialPreviewHtml', () => {
      const res = checkboxesField.getInitialPreviewHtml()
      expect(res).toContain('Item text')
    })

    test('should getNewOptionHtml', () => {
      const res = checkboxesField.getNewOptionHtml(
        123,
        'new-id',
        'label',
        'hint',
        'value'
      )
      expect(res).toContain('data-index="124"')
      expect(res).toContain('data-id="new-id"')
      expect(res).toContain('data-val="value"')
    })

    test('should getSingleOptionHtml', () => {
      const res = checkboxesField.getSingleOptionHtml(123, 'label', 'hint')
      expect(res).toContain(' value="label"')
      expect(res).toContain('>label<')
      expect(res).toContain('>hint</div>')
    })

    test('should getNewOptionPreview when values supplied', () => {
      const newHintElem = document.createElement('input')
      const res = checkboxesField.getNewOptionPreview(
        'label',
        'hint',
        'value',
        newHintElem
      )
      expect(res).toContain('>label<')
      expect(res).toContain('>hint</div>')
    })

    test('should getNewOptionPreview using default values', () => {
      const newHintElem = document.createElement('input')
      // TODO document.activeElement = newHintElem
      const res = checkboxesField.getNewOptionPreview(
        'label',
        '',
        'value',
        newHintElem
      )
      expect(res).toContain('>label<')
      expect(res).not.toContain('>Hint text</div>')
      expect(res).not.toContain('>hint</div>')
    })

    test('should getHtmlForInsert', () => {
      const res = checkboxesField.getHtmlForInsert(123, 'label', 'hint')
      expect(res).toContain(' value="label"')
      expect(res).toContain('>label<')
      expect(res).toContain('>hint</div>')
    })
  })
})
