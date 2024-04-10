import { type FormConfiguration } from '@defra/forms-model'
import { Service } from '@hapipal/schmervice'

export interface PersistenceService extends Service {
  logger: any
  listAllConfigurations(): Promise<FormConfiguration[]>
  getConfiguration(id: string): Promise<string>
  uploadConfiguration(id: string, configuration: string): Promise<any>
  copyConfiguration(configurationId: string, newName: string): Promise<any>
}

export class StubPersistenceService
  extends Service
  implements PersistenceService
{
  logger: any
  uploadConfiguration(_id: string, _configuration: any) {
    return Promise.resolve(undefined)
  }

  listAllConfigurations() {
    return Promise.resolve([])
  }

  getConfiguration(_id: string) {
    return Promise.resolve('')
  }

  copyConfiguration(_configurationId: string, _newName: string) {
    return Promise.resolve('')
  }
}
