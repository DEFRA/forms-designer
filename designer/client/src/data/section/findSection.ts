import { type FormDefinition } from '@defra/forms-model'

export function findSection({ sections }: FormDefinition, name?: string) {
  return sections.find((section) => section.name === name)
}
