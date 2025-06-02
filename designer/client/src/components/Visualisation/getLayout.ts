import { graphlib, layout, type GraphEdge, type Node } from '@dagrejs/dagre'
import {
  Engine,
  hasNext,
  isConditionWrapper,
  type FormDefinition
} from '@defra/forms-model'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { findPage } from '~/src/data/page/findPage.js'

export interface Point {
  node: Node
  top: string
  left: string
}

export interface Edge extends GraphEdge {
  source: string
  target: string
  label: string
}

export interface Pos {
  nodes: Point[]
  edges: Edge[]
  width: string
  height: string
}

export const getLayout = (data: FormDefinition, el: HTMLDivElement) => {
  const { engine, conditions, pages } = data

  // Create a new directed graph
  const g = new graphlib.Graph()

  // Set an object for the graph label
  g.setGraph({
    rankdir: engine === Engine.V2 ? 'TB' : 'LR',
    align: 'UL',
    marginx: 30,
    marginy: 0,
    edgesep: 80,
    nodesep: 80,
    ranksep: 80
  })

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function () {
    return {}
  })

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each node
  pages.forEach((page, index) => {
    const pageEl = el.children[index] as HTMLDivElement

    g.setNode(page.path, {
      label: page.path,
      width: pageEl.offsetWidth,
      height: pageEl.offsetHeight
    })
  })

  // Add edges to the graph.
  pages.forEach((page, index) => {
    if (engine === Engine.V2) {
      if (index < pages.length - 1) {
        const pageNext = pages.at(index + 1)

        if (pageNext) {
          g.setEdge(page.path, pageNext.path)
        }
      }
    } else {
      if (!hasNext(page)) {
        return
      }

      page.next.forEach((next) => {
        try {
          const pageNext = findPage(data, next.path)
          const condition = conditions
            .filter(isConditionWrapper)
            .find(({ name }) => name === next.condition)

          g.setEdge(page.path, pageNext.path, {
            label: condition?.displayName,
            width: condition?.displayName ? 270 : undefined
          })
        } catch (error) {
          logger.error(error, 'Visualisation')
        }
      })
    }
  })

  layout(g)

  const output = g.graph()

  const pos: Pos = {
    nodes: [],
    edges: [],
    width: `${output.width}px`,
    height: `${output.height}px`
  }

  g.nodes().forEach((v) => {
    const node = g.node(v)
    const pt: Point = {
      node,
      top: `${node.y - node.height / 2}px`,
      left: `${node.x - node.width / 2}px`
    }

    pos.nodes.push(pt)
  })

  g.edges().forEach((e) => {
    const edge = g.edge(e)
    pos.edges.push({
      source: e.v,
      target: e.w,
      label: typeof edge.label === 'string' ? edge.label : '',
      points: edge.points.map((p) => {
        return {
          y: p.y,
          x: p.x
        }
      })
    })
  })

  return { g, pos }
}
