import { S3PersistenceService } from '~/src/lib/persistence/s3PersistenceService'
import { BlobPersistenceService } from '~/src/lib/persistence/blobPersistenceService'
import { StubPersistenceService } from '~/src/lib/persistence/persistenceService'
import { PreviewPersistenceService } from '~/src/lib/persistence/previewPersistenceService'

type Name = 's3' | 'blob' | 'preview'

export function determinePersistenceService(name: Name, server: any) {
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
