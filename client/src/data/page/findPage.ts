import { type FormDefinition } from '@defra/forms-model'

/**
 * Find page by path
 */
export function findPage(
  { pages }: Pick<FormDefinition, 'pages'>,
  pathSearch?: string
) {
  const page = pages.find(({ path }) => path === pathSearch)

  if (!page) {
    throw Error(`Page not found for path '${pathSearch}'`)
  }

  return page
}
