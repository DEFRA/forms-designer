import { customAlphabet } from 'nanoid'

/**
 * Custom alphabet is required because a number of formats of ID are invalid property names
 * and expr-eval (condition logic) will fail to execute.
 */
export const randomId = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6
)
