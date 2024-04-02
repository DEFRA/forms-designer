import { join } from 'node:path'

export { type PrismaClient, type Prisma, type Submission } from '@prisma/client'
export const SCHEMA_LOCATION = join(import.meta.dirname, 'schema.prisma')
