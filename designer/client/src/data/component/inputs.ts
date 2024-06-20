import {
  ComponentType,
  hasContentField,
  type FormDefinition,
  type InputFieldsComponentsDef,
  type ListComponent,
  type ListComponentsDef
} from '@defra/forms-model'

import { allPathsLeadingTo } from '~/src/data/page/allPathsLeadingTo.js'
import { type Input, type Path } from '~/src/data/types.js'

export function allInputs(data: FormDefinition): Input[] {
  const { pages = [] } = data

  return pages.flatMap((page) => {
    const inputs = (page.components ?? []).filter(
      (
        component
      ): component is
        | InputFieldsComponentsDef
        | Exclude<ListComponentsDef, ListComponent> =>
        // Exclude content components from condition lists
        !hasContentField(component) &&
        // Exclude list component from condition lists
        component.type !== ComponentType.List
    )

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
