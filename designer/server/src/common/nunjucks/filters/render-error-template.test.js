import { ComponentType } from '@defra/forms-model'
import Joi from 'joi'

import { renderErrorTemplate } from '~/src/common/nunjucks/filters/render-error-template.js'
import * as renderModule from '~/src/common/nunjucks/render.js'
import * as errorPreviewHelper from '~/src/lib/error-preview-helper.js'

jest.mock('~/src/common/nunjucks/render.js', () => ({
  expandTemplate: jest.fn(),
  createJoiExpression: jest.fn()
}))

jest.mock('~/src/lib/error-preview-helper.js', () => ({
  determineLimit: jest.fn(),
  insertTags: jest.fn((template) => `Processed: ${template}`)
}))

describe('render-error-template', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // @ts-expect-error - mockReturnValue is not a function
    renderModule.expandTemplate.mockImplementation(
      (/** @type {{ source: any; }} */ template) =>
        typeof template === 'string' ? template : template.source
    )
    // @ts-expect-error - mockReturnValue is not a function
    errorPreviewHelper.determineLimit.mockReturnValue('10')
  })

  test('should handle string templates correctly', () => {
    const template = {
      type: 'max',
      template: 'Please enter no more than {{#limit}} characters'
    }

    const viewModel = {
      basePageFields: [{ id: 'shortDescription', value: 'Test Description' }],
      extraFields: [{ name: 'maxLength', value: '10' }]
    }

    renderErrorTemplate(template, viewModel, ComponentType.TextField)

    expect(errorPreviewHelper.insertTags).toHaveBeenCalledWith(
      'Please enter no more than {{#limit}} characters',
      'max'
    )

    expect(renderModule.expandTemplate).toHaveBeenCalled()
    expect(renderModule.expandTemplate).toHaveBeenCalledWith(
      expect.anything(),
      {
        label: 'Test Description',
        title: 'Test Description',
        limit: '10'
      }
    )
  })

  test('should handle page template correctly', () => {
    const template = {
      type: 'max',
      template: 'Please enter no more than {{#limit}} characters'
    }

    const viewModel = {}

    renderErrorTemplate(template, viewModel, ComponentType.TextField)

    expect(errorPreviewHelper.insertTags).toHaveBeenCalledWith(
      'Please enter no more than {{#limit}} characters',
      'max'
    )

    expect(renderModule.expandTemplate).toHaveBeenCalled()
    expect(renderModule.expandTemplate).toHaveBeenCalledWith(
      expect.anything(),
      {
        label: '[Short description]',
        title: '[Short description]',
        limit: '10'
      }
    )
  })

  test('should handle Joi expressions correctly', () => {
    const joiExpression = Joi.expression('Enter {{#limit}} or fewer characters')

    const template = {
      type: 'max',
      template: joiExpression
    }

    const viewModel = {
      basePageFields: [{ id: 'shortDescription', value: 'Test Description' }],
      extraFields: [{ name: 'maxLength', value: '10' }]
    }

    // @ts-expect-error - mockReturnValueOnce is not a function
    errorPreviewHelper.insertTags.mockReturnValueOnce('Processed Joi template')

    const mockExpression = { source: 'Processed Joi template', _functions: {} }
    Joi.expression = jest.fn().mockReturnValue(mockExpression)

    renderErrorTemplate(template, viewModel, ComponentType.TextField)

    expect(errorPreviewHelper.insertTags).toHaveBeenCalled()

    expect(Joi.expression).toHaveBeenCalled()

    expect(renderModule.expandTemplate).toHaveBeenCalled()
  })

  test('should default to placeholder when shortDescription is not available', () => {
    const template = {
      type: 'required',
      template: '{{#label}} is required'
    }

    const viewModel = {
      basePageFields: [],
      extraFields: []
    }

    renderErrorTemplate(template, viewModel, ComponentType.TextField)

    // @ts-expect-error - mock.calls is not a function
    expect(renderModule.expandTemplate.mock.calls[0][1]).toEqual({
      label: '[Short description]',
      title: '[Short description]',
      limit: '10'
    })
  })

  test('should call determineLimit with correct parameters', () => {
    const template = {
      type: 'min',
      template: '{{#label}} must be at least {{#limit}} characters'
    }

    const extraFields = [{ name: 'minLength', value: '5' }]

    const viewModel = {
      basePageFields: [{ id: 'shortDescription', value: 'Test Field' }],
      extraFields
    }

    renderErrorTemplate(template, viewModel, ComponentType.TextField)

    expect(errorPreviewHelper.determineLimit).toHaveBeenCalledWith(
      'min',
      extraFields,
      ComponentType.TextField
    )
  })
})
