import { type Server } from '@hapi/hapi'

import { BlobPersistenceService } from '~/src/lib/persistence/blobPersistenceService.js'
import { StubPersistenceService } from '~/src/lib/persistence/persistenceService.js'
import { PreviewPersistenceService } from '~/src/lib/persistence/previewPersistenceService.js'
import { S3PersistenceService } from '~/src/lib/persistence/s3PersistenceService.js'

type Name = 's3' | 'blob' | 'preview'

export function determinePersistenceService(name: Name, server: Server) {
  switch (name) {
    case 's3':
      return () => new S3PersistenceService(server)
    case 'blob':
      return () => new BlobPersistenceService()
    case 'preview':
      return () => new PreviewPersistenceService()
    default:
      return () => new StubPersistenceService()
  }
}
