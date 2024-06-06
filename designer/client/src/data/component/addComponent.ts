import { type ComponentDef, type FormDefinition } from '@defra/forms-model'

import { findPage } from '~/src/data/page/findPage.js'
import { type Path } from '~/src/data/types.js'

export function addComponent(
  data: FormDefinition,
  pagePath: Path,
  component: ComponentDef
): FormDefinition {
  const [page, index] = findPage(data, pagePath)

  const { components = [] } = page
  const updatedPage = { ...page, components: [...components, component] }
  return {
    ...data,
    pages: data.pages.map((page, i) => (index === i ? updatedPage : page))
  }
}
