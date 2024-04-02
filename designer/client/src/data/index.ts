/**
 * This replaces the class data-model (deprecated) which we previously used to mutate {@link FormDefinition} before it is saved.
 * They were written FP style. When {@link FormDefinition} is passed in, it will be copied via destructuring `{...data}`, and the mutation applied.
 */

export * from '~/src/data/types.js'
export * from '~/src/data/component/index.js'
export * from '~/src/data/list/index.js'
export * from '~/src/data/page/index.js'
export * from '~/src/data/section/index.js'
export * from '~/src/data/condition/index.js'
