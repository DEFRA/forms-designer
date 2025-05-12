declare module 'joi' {
  interface JoiExpressionReturn {
    source: string
    rendered: string
    _functions: unknown
    render: (p1, p2, p3, p4, p5) => string
  }

  type JoiExpression = JoiExpressionReturn | string

  function isExpression(expr: JoiExpression): boolean

  function expression(template: string, options?: unknown): JoiExpression
}
