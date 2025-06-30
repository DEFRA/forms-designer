import { stringHasValue } from "~/src/lib/utils.js"

/**
 * @param {string} focusStr
 */
export function getFocus(focusStr) {
  const [direction, questionId] = focusStr ? focusStr.split('|') : []
  if (!stringHasValue(direction) || !stringHasValue(questionId)) {
    return undefined
  }

  return {
    questionId,
    button: direction
  }
}
