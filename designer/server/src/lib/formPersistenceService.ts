import { type FormDefinition } from '@defra/forms-model'
import Wreck from '@hapi/wreck'

import config from '~/src/config.js'

export async function getDraftFormDefinition(
  id: string
): Promise<FormDefinition | null> {
  const { payload } = await Wreck.get<FormDefinition>(
    `${config.managerUrl}/forms/${id}/definition/draft`
  )
  return payload
}

export function updateDraftFormDefinition(id: string, configuration: string) {
  return Wreck.post(`${config.managerUrl}/forms/${id}/definition/draft`, {
    payload: configuration
  })
}
