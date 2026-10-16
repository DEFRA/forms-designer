import {
  hasNext,
  type FormDefinition,
  type Link,
  type Page
} from '@defra/forms-model'
import dfs, { type Edge } from 'depth-first'

export function findPathsTo({ pages }: FormDefinition, pathTo?: string) {
  if (!pathTo) {
    return []
  }

  const edges = pages.filter(hasNext).flatMap(pageToEdges)
  return dfs(edges, pathTo, { reverse: true }).reverse()
}

export function pageToEdges(page: Extract<Page, { next: Link[] }>) {
  return page.next.map(linkToEdge.bind(page))
}

export function linkToEdge(this: Extract<Page, { next: Link[] }>, link: Link) {
  return [this.path, link.path] satisfies Edge<string>
}
