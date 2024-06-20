import { type FormDefinition } from '@defra/forms-model'

import { findPage } from '~/src/data/page/findPage.js'
import { type Path } from '~/src/data/types.js'

export function deleteLink(
  data: FormDefinition,
  from: Path,
  to: Path
): FormDefinition {
  const [fromPage] = findPage(data, from)

  findPage(data, to)

  const toLinkIndex = fromPage.next?.findIndex((n) => n.path === to) ?? -1

  if (!fromPage.next || toLinkIndex < 0) {
    throw Error('Could not find page or links to delete')
  }

  fromPage.next.splice(toLinkIndex, 1)

  const pages = [...data.pages].map((page) =>
    page.path === fromPage.path ? fromPage : page
  )

  return { ...data, pages }
}
