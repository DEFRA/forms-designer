import { patchPageSchema } from '~/src/form/form-manager/index.js'
import { type PatchPageFields } from '~/src/form/form-manager/types.js'

describe('Form manager schema', () => {
  let patchPage: PatchPageFields

  beforeEach(() => {
    patchPage = {
      title: 'Updated page title',
      path: '/updated-page-title'
    }
  })

  describe('pagePatchSchema', () => {
    it('should allow title to be submitted', () => {
      patchPage = {
        title: patchPage.title
      }

      const result = patchPageSchema.validate(patchPage, {
        abortEarly: false
      })
      expect(result.error).toBeUndefined()
    })
    it('should allow title & path to be submitted', () => {
      const result = patchPageSchema.validate(patchPage, {
        abortEarly: false
      })
      expect(result.error).toBeUndefined()
    })
    it('should not allow empty object', () => {
      const result = patchPageSchema.validate(
        {},
        {
          abortEarly: false
        }
      )
      expect(result.error?.message).toBe('"value" must have at least 1 key')
    })
  })
})
