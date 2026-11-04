import { logContextMixin } from '@defra/forms-common'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'

describe('logger-options', () => {
  it('should use the forms-common log context mixin', () => {
    expect(loggerOptions.mixin).toBe(logContextMixin)
  })
})
