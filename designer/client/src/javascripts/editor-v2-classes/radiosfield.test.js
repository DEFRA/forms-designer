import { RadiosField } from '~/src/javascripts/editor-v2-classes/radiosfield.js'

describe('RadiosField class', () => {
  const radiosField = new RadiosField(document)
  describe('initialisation', () => {
    test('should create class', () => {
      expect(radiosField).toBeDefined()
    })

    test('should getInitialPreviewHtml', () => {
      const res = radiosField.getInitialPreviewHtml()
      expect(res).toContain('Item text')
    })

    test('should getNewOptionHtml', () => {
      const res = radiosField.getNewOptionHtml(
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
      const res = radiosField.getSingleOptionHtml(123, 'label', 'hint')
      expect(res).toContain(' value="label"')
      expect(res).toContain('>label<')
      expect(res).toContain('>hint</div>')
    })

    test('should getNewOptionPreview when values supplied', () => {
      const newHintElem = document.createElement('input')
      const res = radiosField.getNewOptionPreview(
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
      const res = radiosField.getNewOptionPreview(
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
      const res = radiosField.getHtmlForInsert(123, 'label', 'hint')
      expect(res).toContain(' value="label"')
      expect(res).toContain('>label<')
      expect(res).toContain('>hint</div>')
    })
  })
})
