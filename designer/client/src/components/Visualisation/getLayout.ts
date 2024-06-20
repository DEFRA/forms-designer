import { graphlib, layout, type GraphEdge, type Node } from '@dagrejs/dagre'
import { type FormDefinition } from '@defra/forms-model'

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
  // Create a new directed graph
  const g = new graphlib.Graph()

  // Set an object for the graph label
  g.setGraph({
    rankdir: 'LR',
    marginx: 50,
    marginy: 100,
    ranksep: 160
  })

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function () {
    return {}
  })

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each node
  data.pages.forEach((page, index) => {
    const pageEl = el.children[index] as HTMLDivElement

    g.setNode(page.path, {
      label: page.path,
      width: pageEl.offsetWidth,
      height: pageEl.offsetHeight
    })
  })

  // Add edges to the graph.
  data.pages.forEach((page) => {
    if (Array.isArray(page.next)) {
      page.next.forEach((next) => {
        // The linked node (next page) may not exist if it's filtered
        const exists = data.pages.find((page) => page.path === next.path)
        if (exists) {
          g.setEdge(page.path, next.path, {
            condition: data.conditions.find(
              (condition) => condition.name === next.condition
            )?.displayName
          })
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
      label: typeof edge.condition === 'string' ? edge.condition : '',
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
