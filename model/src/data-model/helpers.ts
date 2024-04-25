import { type MultipleApiKeys } from '~/src/form/types.js'

export function isMultipleApiKey(
  payApiKey: string | MultipleApiKeys | undefined
): payApiKey is MultipleApiKeys {
  const obj = payApiKey as MultipleApiKeys
  return obj.test !== undefined || obj.production !== undefined
}
