import {
  hasNext,
  type FormDefinition,
  type Link,
  type PageQuestion,
  type PageStart
} from '@defra/forms-model'
import dfs, { type Edge } from 'depth-first'

export function findPathsTo({ pages }: FormDefinition, pathTo?: string) {
  if (!pathTo) {
    return []
  }

  const edges = pages.filter(hasNext).flatMap(pageToEdges)
  return dfs(edges, pathTo, { reverse: true }).reverse()
}

export function pageToEdges(page: PageStart | PageQuestion) {
  return page.next.map(linkToEdge.bind(page))
}

export function linkToEdge(this: PageStart | PageQuestion, link: Link) {
  return [this.path, link.path] satisfies Edge<string>
}
