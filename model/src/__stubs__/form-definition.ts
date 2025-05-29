import { type FormDefinition } from '~/src/form/form-definition/types.js'
import { type FormMetadata } from '~/src/form/form-metadata/types.js'

/**
 * Builder to create a Form Definition
 * @param {Partial<FormDefinition>} definitionPartial
 * @returns {FormDefinition}
 */
export function buildDefinition(
  definitionPartial: Partial<FormDefinition> = {}
): FormDefinition {
  const formDefinition: FormDefinition = {
    name: 'Test form',
    pages: [],
    conditions: [],
    sections: [],
    lists: []
  }
  return {
    ...formDefinition,
    ...definitionPartial
  }
}

/**
 *
 * @param {Partial<FormMetadata>} partialMetaData
 * @returns {FormMetadata}
 */
export function buildMetaData(
  partialMetaData: Partial<FormMetadata> = {}
): FormMetadata {
  return {
    id: '681b184463c68bf6b99e2c62',
    slug: 'chemistry',
    title: 'Chemistry',
    organisation: 'Defra',
    teamName: 'Forms Team',
    teamEmail: 'name@example.gov.uk',
    draft: {
      createdAt: new Date('2025-05-07T08:22:28.035Z'),
      createdBy: {
        id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
        displayName: 'Internal User'
      },
      updatedAt: new Date('2025-05-20T13:00:54.794Z'),
      updatedBy: {
        id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
        displayName: 'Internal User'
      }
    },
    createdBy: {
      id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
      displayName: 'Internal User'
    },
    createdAt: new Date('2025-05-07T08:22:28.035Z'),
    updatedBy: {
      id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
      displayName: 'Internal User'
    },
    updatedAt: new Date('2025-05-20T13:00:54.794Z'),
    ...partialMetaData
  }
}
