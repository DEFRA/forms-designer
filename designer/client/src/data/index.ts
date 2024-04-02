/**
 * This replaces the class data-model (deprecated) which we previously used to mutate {@link FormDefinition} before it is saved.
 * They were written FP style. When {@link FormDefinition} is passed in, it will be copied via destructuring `{...data}`, and the mutation applied.
 */

export * from '~/src/data/types'
export * from '~/src/data/component'
export * from '~/src/data/list'
export * from '~/src/data/page'
export * from '~/src/data/section'
export * from '~/src/data/condition'
