describe('question', () => {
  describe('QuestionElements', () => {
    const html =
      '<form class="form" method="post" id="question-form">\n' +
      '  <div class="govuk-form-group">\n' +
      '    <div class="govuk-form-group">\n' +
      '      <label class="govuk-label govuk-label--m" for="question">\n' +
      '        Question\n' +
      '      </label>\n' +
      '      <input class="govuk-input" id="question" name="question" type="text" value="What is your firstname?">\n' +
      '    </div>\n' +
      '\n' +
      '    <div class="govuk-form-group">\n' +
      '      <label class="govuk-label govuk-label--m" for="hintText">\n' +
      '        Hint text (optional)\n' +
      '      </label>\n' +
      '      <textarea class="govuk-textarea" id="hintText" name="hintText" rows="3"></textarea>\n' +
      '    </div>\n' +
      '\n' +
      '    <div class="govuk-form-group">\n' +
      '      <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes" data-govuk-checkboxes-init="">\n' +
      '        <div class="govuk-checkboxes__item">\n' +
      '          <input class="govuk-checkboxes__input" id="questionOptional" name="questionOptional" type="checkbox" value="true">\n' +
      '          <label class="govuk-label govuk-checkboxes__label" for="questionOptional">\n' +
      '            Make this question optional\n' +
      '          </label>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</form>'

    it('should', async () => {
      document.body.innerHTML = html
      const test = document.getElementById('question')
      await Promise.resolve()
      expect(test?.getAttribute('value')).toBe('What is your firstname?')
    })
  })
})
