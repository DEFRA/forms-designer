import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildBoom409 } from '~/src/lib/__stubs__/editor.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'

describe('Boom error helper', () => {
  describe('checkBoomError', () => {
    test('should handle if no boom message passed', () => {
      const error = checkBoomError(
        buildBoom409(undefined),
        sessionNames.validationFailure.editorQuestionDetails
      )
      expect(error).toBeInstanceOf(Joi.ValidationError)
      expect(error?.details[0].message).toBe('An error occurred')
      expect(error?.details[0].path).toEqual(['general'])
    })
  })
})
