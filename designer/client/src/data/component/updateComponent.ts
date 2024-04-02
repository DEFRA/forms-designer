import { Path, findPage } from '~/src/data/index.js'
import { ComponentDef } from '@defra/forms-model'

export function updateComponent(
  data,
  pagePath: Path,
  componentName: ComponentDef['name'],
  component: ComponentDef
) {
  const [page] = findPage(data, pagePath)
  const components = [...(page.components ?? [])]
  const componentIndex =
    page.components?.findIndex(
      (component: ComponentDef) => component.name === componentName
    ) ?? -1

  if (componentIndex < 0) {
    throw Error(
      `No component exists with name ${componentName} with in page with path ${pagePath}`
    )
  }

  const updatedPage = {
    ...page,
    components: components.map((c, i) => (i === componentIndex ? component : c))
  }

  const updatedPages = data.pages.map((pg) =>
    pg.path === pagePath ? updatedPage : pg
  )

  return { ...data, pages: updatedPages }
}
