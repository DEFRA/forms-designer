import { ComponentType } from '@defra/forms-model'
import { getTraceId } from '@defra/hapi-tracing'

import { testFormDefinitionWithTwoPagesAndQuestions } from '~/src/__stubs__/form-definition.js'
import config from '~/src/config.js'
import { getComponentFromDefinition, getHeaders } from '~/src/lib/utils.js'

jest.mock('@defra/hapi-tracing')

describe('Header helper functions', () => {
  describe('getHeaders', () => {
    it('should include the trace id in the headers if available', () => {
      jest.mocked(getTraceId).mockReturnValue('my-trace-id')

      const result = getHeaders('token')
      expect(result).toEqual({
        headers: {
          Authorization: 'Bearer token',
          [config.tracing.header]: 'my-trace-id'
        }
      })
    })

    it('should exclude the trace id in the headers if missing', () => {
      jest.mocked(getTraceId).mockReturnValue(null)

      const result = getHeaders('token')
      expect(result).toEqual({
        headers: {
          Authorization: 'Bearer token'
        }
      })
    })
  })

  describe('getComponentFromDefinition', () => {
    it('should find component when exists', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1',
        'q1'
      )
      expect(comp).toEqual({
        id: 'q1',
        type: ComponentType.TextField,
        name: 'textField',
        title: 'This is your first question',
        hint: 'Help text',
        options: {},
        schema: {}
      })
    })

    it('should return undefined when component not found', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1',
        'qxx'
      )
      expect(comp).toBeUndefined()
    })

    it('should return undefined when page not found', () => {
      const comp = getComponentFromDefinition(
        testFormDefinitionWithTwoPagesAndQuestions,
        'p1xx',
        'q1'
      )
      expect(comp).toBeUndefined()
    })
  })
})
