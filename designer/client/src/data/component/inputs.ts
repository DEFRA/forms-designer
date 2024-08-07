import {
  hasConditionSupport,
  hasContent,
  type FormDefinition
} from '@defra/forms-model'

import { allPathsLeadingTo } from '~/src/data/page/allPathsLeadingTo.js'
import { type Input, type Path } from '~/src/data/types.js'

export function allInputs(data: FormDefinition): Input[] {
  const { pages = [] } = data

  return pages.flatMap((page) => {
    const inputs = (page.components ?? [])
      .filter(hasConditionSupport)
      .filter((component) => !hasContent(component))

    return inputs.map((input) => {
      return {
        name: input.name,
        page: { path: page.path, section: page.section },
        propertyPath: page.section
          ? `${page.section}.${input.name}`
          : input.name,
        title: input.title,
        list: 'list' in input ? input.list : undefined,
        type: input.type
      }
    })
  })
}

export function inputsAccessibleAt(data: FormDefinition, path: Path) {
  const pages = allPathsLeadingTo(data, path)
  return allInputs({
    ...data,
    pages: data.pages.filter((page) => pages.includes(page.path))
  })
}
