declare module 'joi-to-json' {
  import { type Schema } from 'joi'

  /**
   * Converts a Joi schema to a JSON Schema
   */
  function parse(
    joiSchema: Schema,
    type?: string,
    definitions?: object,
    parserOptions?: object
  ): object

  export = parse
}
