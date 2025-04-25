/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentType } from '@defra/forms-model'

import { CheckboxesField } from '~/src/javascripts/editor-v2-classes/checkboxesfield.js'
import { RadiosField } from '~/src/javascripts/editor-v2-classes/radiosfield.js'
import { TextField } from '~/src/javascripts/editor-v2-classes/textfield.js'

/**
 * @param {ComponentType} questionType
 */
function initialiseComponent(questionType) {
  if (questionType === ComponentType.RadiosField) {
    // eslint-disable-next-line no-new
    new RadiosField(document)
  } else if (questionType === ComponentType.CheckboxesField) {
    // eslint-disable-next-line no-new
    new CheckboxesField(document)
  } else {
    // TODO (questionType === ComponentType.TextField) {
    // TextField and others
    // eslint-disable-next-line no-new
    new TextField(document)
  }
}

const questionTypeElem = /** @type { HTMLInputElement | null } */ (
  document.getElementById('questionType')
)
if (questionTypeElem) {
  const questionType = /** @type { string } */ (questionTypeElem.value)
  initialiseComponent(/** @type {ComponentType} */ (questionType))
}
