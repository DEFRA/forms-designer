/* eslint-disable @typescript-eslint/no-unused-vars */
import { RadiosField } from '~/src/javascripts/editor-v2-classes/radiosfield.js'
import { TextField } from '~/src/javascripts/editor-v2-classes/textfield.js'

/**
 * @param {string} questionType
 */
function initialiseComponent(questionType) {
  let instance
  if (questionType === 'TextField') {
    instance = new TextField(document)
  } else if (questionType === 'RadiosField') {
    instance = new RadiosField(document)
  }
}

// @ts-expect-error TODO some text to explain
initialiseComponent(document.questionType)
