import {
  type FormDefinition,
  type Link,
  type PageWithNext
} from '@defra/forms-model'
import dfs, { type Edge } from 'depth-first'

import { hasNext } from '~/src/data/page/hasNext.js'

export function findPathsTo({ pages }: FormDefinition, pathTo: string) {
  const edges = pages.filter(hasNext).flatMap(pageToEdges)
  return dfs(edges, pathTo, { reverse: true }).reverse()
}

export function pageToEdges(page: PageWithNext) {
  return page.next.map(linkToEdge.bind(page))
}

export function linkToEdge(this: PageWithNext, link: Link) {
  return [this.path, link.path] satisfies Edge<string>
}
