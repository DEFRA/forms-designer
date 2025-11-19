export const locationQuestionLeftPanelHTML = `
<div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="question">
    Question text
  </label>
  <textarea class="govuk-textarea" id="question" name="question" rows="5">Which quest would you like to pick?</textarea>
</div>

<div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="hintText">
    Hint text (optional)
  </label>
  <textarea class="govuk-textarea" id="hintText" name="hintText" rows="5">Choose one adventure that best suits you.</textarea>
</div>

<div class="govuk-form-group">
  <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
    <div class="govuk-checkboxes__item">
      <input class="govuk-checkboxes__input" id="giveInstructions" name="giveInstructions" type="checkbox" value="true">
      <label class="govuk-label govuk-checkboxes__label" for="giveInstructions">
        Give specific instructions
      </label>
    </div>
  </div>
</div>

<div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="instructionText">
    Instruction text (optional)
  </label>
  <textarea class="govuk-textarea" id="instructionText" name="instructionText" rows="3">Enter precise coordinates</textarea>
</div>

<div class="govuk-form-group">
  <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
    <div class="govuk-checkboxes__item">
      <input class="govuk-checkboxes__input" id="optional" name="optional" type="checkbox" value="false">
      <label class="govuk-label govuk-checkboxes__label" for="optional">
        Make optional
      </label>
    </div>
  </div>
</div>

<div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="shortDesc">
    Short description (optional)
  </label>
  <textarea class="govuk-textarea" id="shortDesc" name="shortDesc" rows="3"></textarea>
</div>
`

export const locationQuestionPreviewHTML = `
<div class="border-left-container-location" id="preview-panel-content">
  <div id="preview-panel-inner">
    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 class="govuk-fieldset__heading">Which quest would you like to pick?</h1>
        </legend>
        <div id="hint" class="govuk-hint">Choose one adventure that best suits you.</div>
      </fieldset>
    </div>
  </div>
</div>
`
