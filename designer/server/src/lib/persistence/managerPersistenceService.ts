import { type FormDefinition } from '@defra/forms-model'
import Wreck from '@hapi/wreck'
import { Service } from '@hapipal/schmervice'

import config from '~/src/config.js'

export class FormsManagerPersistenceService extends Service {
  async getDraftFormDefinition(id: string): Promise<FormDefinition> {
    const { payload } = await Wreck.get<FormDefinition>(
      `${config.managerUrl}/forms/${id}/definition/draft`
    )
    return payload
  }

  async updateDraftFormDefinition(id: string, configuration: string) {
    return Wreck.post(`${config.managerUrl}/forms/${id}/definition/draft`, {
      payload: configuration
    })
  }
}
