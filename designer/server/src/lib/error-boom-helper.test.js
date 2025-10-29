import {
  FormDefinitionError,
  FormDefinitionErrorType
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import {
  testFormDefinitionWithMultipleV2Conditions,
  testFormDefinitionWithNoPages
} from '~/src/__stubs__/form-definition.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildBoom409 } from '~/src/lib/__stubs__/editor.js'
import {
  checkBoomError,
  handleInvalidFormErrors,
  isInvalidFormError,
  isInvalidFormErrorType,
  unpackErrorToken
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

    test('should return false for non Boom errors', () => {
      expect(isInvalidFormError(new Error())).toBe(false)
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

    test('should return false for if error cause is not an array', () => {
      const cause = undefined

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
      ).toBe(false)
    })

    test('should return false for other Boom errors', () => {
      expect(
        isInvalidFormErrorType(
          Boom.notFound(),
          FormDefinitionError.UniqueConditionDisplayName
        )
      ).toBe(false)
    })

    test('should return false for non Boom errors', () => {
      expect(
        isInvalidFormErrorType(
          new Error(),
          FormDefinitionError.UniqueConditionDisplayName
        )
      ).toBe(false)
    })
  })

  describe('unpackErrorToken', () => {
    const conditionNames = [
      'Condition name 1',
      'Condition name 2',
      'Condition name 3',
      'Condition name 4',
      'Condition name 5'
    ]

    test('should return error referenced object if boom message contains appropiate indexed key (idx 3)', () => {
      const cause = [
        {
          id: FormDefinitionError.RefConditionItemId,
          detail: { path: ['conditions', 3], pos: 1, dupePos: 0 },
          message: '"conditions[3]" references a missing list item',
          type: FormDefinitionErrorType.Ref
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"conditions[3]" references a missing list item', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )
      expect(unpackErrorToken(boomErr, 'conditions', conditionNames)).toBe(
        'Condition name 4'
      )
    })

    test('should return error referenced object if boom message contains appropiate indexed key (idx 1)', () => {
      const cause = [
        {
          id: FormDefinitionError.RefConditionItemId,
          detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
          message: '"conditions[1]" references a missing list item',
          type: FormDefinitionErrorType.Ref
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"conditions[1]" references a missing list item', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )
      expect(unpackErrorToken(boomErr, 'conditions', conditionNames)).toBe(
        'Condition name 2'
      )
    })

    test('should return unknown if token not found', () => {
      const cause = [
        {
          id: FormDefinitionError.RefConditionItemId,
          detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
          message: '"conditions[1]" references a missing list item',
          type: FormDefinitionErrorType.Ref
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"conditions[1]" references a missing list item', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )
      expect(unpackErrorToken(boomErr, 'missing-token', conditionNames)).toBe(
        'Unknown'
      )
    })
  })

  describe('handleInvalidFormErrors', () => {
    test('should return error for RefConditionItemId', () => {
      const cause = [
        {
          id: FormDefinitionError.RefConditionItemId,
          detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
          message: '"conditions[1]" missing reference',
          type: FormDefinitionErrorType.Ref
        }
      ]

      const boomErr = Boom.boomify(
        new Error('"conditions[1]" missing reference', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      const res = handleInvalidFormErrors(
        boomErr,
        testFormDefinitionWithMultipleV2Conditions
      )
      expect(res?.message).toBe(
        "A list item used by condition 'isFaveColourRedV2' has been deleted from the list."
      )
    })

    test('should return error for IncompatibleQuestionRegex', () => {
      const cause = [
        {
          id: FormDefinitionError.IncompatibleQuestionRegex,
          message: 'Regex expression is invalid',
          type: FormDefinitionErrorType.Incompatible
        }
      ]

      const boomErr = Boom.boomify(
        new Error('Regex expression is invalid', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      const res = handleInvalidFormErrors(
        boomErr,
        testFormDefinitionWithNoPages
      )
      expect(res?.message).toBe('The regex expression is invalid')
    })
  })
})
