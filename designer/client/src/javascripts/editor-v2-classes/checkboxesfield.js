import { ListField } from '~/src/javascripts/editor-v2-classes/listfield.js'

export class CheckboxesField extends ListField {
  /**
   * @returns {string}
   */
  getBaseClassName() {
    return 'govuk-checkboxes'
  }

  /**
   * @returns {string}
   */
  getInitialPreviewHtml() {
    return `
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="listPreview-option-new" name="listPreview" type="checkbox">
        <label class="govuk-label govuk-checkboxes__label" for="listPreview-option-new">Item text</label>
      </div>
      `
  }

  /**
   * @param {number} newIndex
   * @param {string} newId
   * @param {string} labelValue
   * @param {string} hintValue
   * @param {string} valueValue
   * @returns {string}
   */
  getNewOptionHtml(newIndex, newId, labelValue, hintValue, valueValue) {
    return `
      <li class="gem-c-reorderable-list__item" data-index="${newIndex + 1}" data-id="${newId}" data-val="${valueValue}">
        <div class="gem-c-reorderable-list__wrapper">
          <div class="gem-c-reorderable-list__content">
            <p class="govuk-body fauxlabel option-label-display" id="option-${newIndex + 1}-label-display">
              ${labelValue}
            </p>
            ${
              hintValue
                ? `
            <p class="govuk-hint fauxlabel option-label-display" style="color: #505a5f;">
              ${hintValue}
            </p>
            `
                : ''
            }
          </div>
          <div class="gem-c-reorderable-list__actions">
            <button class="gem-c-button govuk-button govuk-button--secondary js-reorderable-list-up"
              type="button" aria-label="Move option up">Up</button>
            <button class="gem-c-button govuk-button govuk-button--secondary js-reorderable-list-down"
              type="button" aria-label="Move option down">Down</button>
          </div>
          <div class="edit-item">
            <ul class="govuk-summary-list__actions-list">
              <li class="govuk-summary-list__actions-list-item">
                <a class="govuk-link govuk-link--no-visited-state edit-option-link" href="editoption.html?index=${newIndex + 1}">
                  Edit<span class="govuk-visually-hidden">option ${newIndex + 1}</span>
                </a>
              </li>
              <li class="govuk-summary-list__actions-list-item">
                <a class="govuk-link govuk-link--destructive delete-option-link" href="delete-option.html?index=${newIndex + 1}&text=${encodeURIComponent(labelValue)}" onclick="return true;">
                  Delete<span class="govuk-visually-hidden"> list item</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </li>
    `
  }

  /**
   * @param {number} index
   * @param { string | undefined } label
   * @param { string | undefined } hint
   * @returns {string}
   */
  getSingleOptionHtml(index, label, hint) {
    return `
    <div class="govuk-checkboxes__item">
      <input class="govuk-checkboxes__input" id="listPreview-option${index}" name="listPreview" type="checkbox" value="${label}">
      <label class="govuk-label govuk-checkboxes__label" for="listPreview-option${index}">${label}</label>
      ${hint ? `<div class="govuk-hint govuk-checkboxes__hint">${hint}</div>` : ''}
    </div>
    `
  }

  /**
   * @param {string} labelValue
   * @param { string | undefined } hintValue
   * @param {string} valueAttr
   * @param {Element} newOptionHint
   * @returns {string}
   */
  getNewOptionPreview(labelValue, hintValue, valueAttr, newOptionHint) {
    return `
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="listPreview-option-new" name="listPreview" type="checkbox" value="${valueAttr}">
        <label class="govuk-label govuk-checkboxes__label" for="listPreview-option-new">${labelValue !== '' ? labelValue : 'Item text'}</label>
        ${hintValue || document.activeElement === newOptionHint ? `<div class="govuk-hint govuk-checkboxes__hint">${hintValue ?? 'Hint text'}</div>` : ''}
      </div>
      `
  }

  /**
   * @param {number} index
   * @param { string | undefined } label
   * @param { string | undefined } hint
   * @returns {string}
   */
  getHtmlForInsert(index, label, hint) {
    return `
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="listPreview-option${index}" name="listPreview" type="checkbox" value="${label}">
        <label class="govuk-label govuk-checkboxes__label" for="listPreview-option${index}">${label}</label>
        ${hint ? `<div class="govuk-hint govuk-checkboxes__hint">${hint}</div>` : ''}
      </div>
    `
  }
}
