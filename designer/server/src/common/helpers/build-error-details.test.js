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
            context: {
              pos: 0,
              value: { text: '', value: '' },
              label: 'autoCompleteOptions[0]',
              key: 0
            }
          }
        ],
        { text: '', value: '' }
      )
      expect(buildErrorDetails(error)).toEqual({
        autoCompleteOptions: {
          text: 'Enter options separated by a colon on line 1',
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
            context: {
              pos: 0,
              value: { text: '', value: '' },
              label: 'unknownKey',
              key: 0
            }
          },
          {
            message,
            context: {
              pos: 1,
              value: { text: '', value: '' },
              label: 'autoCompleteOptions[1]',
              key: 1
            }
          },
          {
            message,
            context: {
              value: { text: '', value: '' },
              label: 'unknownKey2',
              key: 0
            }
          }
        ],
        { text: '', value: '' }
      )
      expect(buildErrorDetails(error)).toEqual({
        autoCompleteOptions: {
          text: message,
          href: '#autoCompleteOptions'
        }
      })
    })
  })
})
