/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentType } from '@defra/forms-model'

import { CheckboxesField } from '~/src/javascripts/editor-v2-classes/checkboxesfield.js'
import { DatePartsField } from '~/src/javascripts/editor-v2-classes/datepartsfield.js'
import { MonthYearField } from '~/src/javascripts/editor-v2-classes/monthyearfield.js'
import { RadiosField } from '~/src/javascripts/editor-v2-classes/radiosfield.js'
import { TextField } from '~/src/javascripts/editor-v2-classes/textfield.js'
import { UkAddressField } from '~/src/javascripts/editor-v2-classes/ukaddressfield.js'
import { YesNoField } from '~/src/javascripts/editor-v2-classes/yesnofield.js'

/**
 * @param {ComponentType} questionType
 */
function initialiseComponent(questionType) {
  let instance
  if (questionType === ComponentType.RadiosField) {
    instance = new RadiosField(document)
  } else if (questionType === ComponentType.CheckboxesField) {
    instance = new CheckboxesField(document)
  } else if (questionType === ComponentType.DatePartsField) {
    instance = new DatePartsField(document)
  } else if (questionType === ComponentType.MonthYearField) {
    instance = new MonthYearField(document)
  } else if (questionType === ComponentType.UkAddressField) {
    instance = new UkAddressField(document)
  } else if (questionType === ComponentType.YesNoField) {
    instance = new YesNoField(document)
  } else {
    // TODO (questionType === ComponentType.TextField) {
    // TextField and others
    instance = new TextField(document)
  }
  return instance
}

const questionTypeElem = /** @type { HTMLInputElement | null } */ (
  document.getElementById('questionType')
)
if (questionTypeElem) {
  const questionType = /** @type { string } */ (questionTypeElem.value)
  initialiseComponent(/** @type {ComponentType} */ (questionType))
}
