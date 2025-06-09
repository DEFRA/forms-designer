import { ValidationError } from 'joi'

import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'

describe('build error details', () => {
  describe('buildErrorDetails', () => {
    it('should return errors on first array item', () => {
      const message = 'Enter options separated by a colon'
      const error = new ValidationError(
        message,
        [
          {
            message,
            path: [],
            type: 'unknown',
            context: {
              pos: 0,
              value: { text: '', value: '' },
              label: 'autoCompleteOptions[0]',
              // @ts-expect-error: Joi has incorrect typings for Context (should be string|number)
              key: 0
            }
          }
        ],
        { text: '', value: '' }
      )
      expect(buildErrorDetails(error)).toEqual({
        autoCompleteOptions: {
          text: 'Enter options separated by a colon on item 1',
          href: '#autoCompleteOptions'
        }
      })
    })

    it('should return errors on array items', () => {
      const message = 'Enter options separated by a colon'
      const error = new ValidationError(
        message,
        [
          {
            message,
            path: [],
            type: 'unknown',
            context: {
              pos: 0,
              value: { text: '', value: '' },
              label: 'unknownKey',
              // @ts-expect-error: Joi has incorrect typings for Context (should be string|number)
              key: 0
            }
          },
          {
            message,
            path: [],
            type: 'unknown',
            context: {
              pos: 1,
              value: { text: '', value: '' },
              label: 'autoCompleteOptions[1]',
              // @ts-expect-error: Joi has incorrect typings for Context (should be string|number)
              key: 1
            }
          },
          {
            message,
            path: [],
            type: 'unknown',
            context: {
              value: { text: '', value: '' },
              label: 'unknownKey2',
              // @ts-expect-error: Joi has incorrect typings for Context (should be string|number)
              key: 0
            }
          }
        ],
        { text: '', value: '' }
      )
      expect(buildErrorDetails(error)).toEqual({
        autoCompleteOptions: {
          text: 'Enter options separated by a colon on item 2',
          href: '#autoCompleteOptions'
        },
        unknownKey2: {
          href: '#unknownKey2',
          text: 'Enter options separated by a colon'
        }
      })
    })
  })
})
