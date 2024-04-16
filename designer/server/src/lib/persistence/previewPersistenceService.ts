import { type FormConfiguration } from '@defra/forms-model'
import Wreck from '@hapi/wreck'
import { Service } from '@hapipal/schmervice'

import config from '~/src/config.js'

/**
 * Persistence service that relies on the runner for storing
 * the form configurations in memory.
 * This should likely never be used in production but is a handy
 * development utility.
 */
export class PreviewPersistenceService extends Service {
  async uploadConfiguration(id: string, configuration: string) {
    return Wreck.post(`${config.publishUrl}/publish`, {
      payload: JSON.stringify({ id, configuration })
    })
  }

  async copyConfiguration(configurationId: string, newName: string) {
    const configuration = await this.getConfiguration(configurationId)
    return this.uploadConfiguration(newName, JSON.parse(configuration).values)
  }

  async listAllConfigurations(): Promise<FormConfiguration[]> {
    const { payload } = await Wreck.get(`${config.publishUrl}/published`)
    return JSON.parse(payload.toString())
  }

  async getConfiguration(id: string) {
    const { payload } = await Wreck.get(`${config.publishUrl}/published/${id}`)
    return payload.toString()
  }
}
