import { type MultipleApiKeys } from '~/src/data-model/types.js'

export function isMultipleApiKey(
  payApiKey: string | MultipleApiKeys | undefined
): payApiKey is MultipleApiKeys {
  const obj = payApiKey as MultipleApiKeys
  return obj.test !== undefined || obj.production !== undefined
}
