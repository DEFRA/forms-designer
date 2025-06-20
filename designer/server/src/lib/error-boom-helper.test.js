import {
  FormDefinitionError,
  FormDefinitionErrorType
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildBoom409 } from '~/src/lib/__stubs__/editor.js'
import {
  checkBoomError,
  isInvalidFormError,
  isInvalidFormErrorType
} from '~/src/lib/error-boom-helper.js'

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

  describe('isInvalidFormError', () => {
    test('should return true for InvalidFormDefinitionError', () => {
      const boomErr = Boom.boomify(new Error(), {
        data: { error: 'InvalidFormDefinitionError' }
      })
      expect(isInvalidFormError(boomErr)).toBe(true)
    })

    test('should return false for other Boom errors', () => {
      expect(isInvalidFormError(Boom.notFound())).toBe(false)
    })
  })

  describe('isInvalidFormErrorType', () => {
    test('should return true for InvalidFormDefinitionError of type UniqueConditionDisplayName', () => {
      const cause = [
        {
          id: FormDefinitionError.UniqueConditionDisplayName,
          detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
          message: '"conditions[1]" contains a duplicate value',
          type: FormDefinitionErrorType.Unique
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"conditions[1]" contains a duplicate value', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      expect(
        isInvalidFormErrorType(
          boomErr,
          FormDefinitionError.UniqueConditionDisplayName
        )
      ).toBe(true)
    })

    test('should return false for other type of FormDefinitionError', () => {
      const cause = [
        {
          id: FormDefinitionError.UniqueListId,
          detail: { path: ['lists', 1], pos: 1, dupePos: 0 },
          message: '"lists[1]" contains a duplicate value',
          type: FormDefinitionErrorType.Unique
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"lists[1]" contains a duplicate value', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      expect(
        isInvalidFormErrorType(
          boomErr,
          FormDefinitionError.UniqueConditionDisplayName
        )
      ).toBe(false)
    })

    test('should return false for other Boom errors', () => {
      expect(isInvalidFormError(Boom.notFound())).toBe(false)
    })
  })
})
