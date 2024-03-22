import { FormDefinition, Page } from '@defra/forms-model'

export function addPage(data: FormDefinition, page: Page): FormDefinition {
  const index = data.pages.findIndex((pg) => pg.path === page.path)
  if (index > -1) {
    throw Error(`A page with the path ${page.path} already exists`)
  }
  return {
    ...data,
    pages: [...data.pages, page]
  }
}
