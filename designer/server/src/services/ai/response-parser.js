import { formDefinitionV2Schema } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export class ParseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParseError'
  }
}

export class ValidationError extends Error {
  /**
   * @param {string} message
   * @param {Array} details
   */
  constructor(message, details = []) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class ResponseParser {
  /**
   * @param {string} aiResponse
   */
  parseFormDefinition(aiResponse) {
    logger.info('🔍 ResponseParser.parseFormDefinition() called', {
      responseLength: aiResponse?.length || 'undefined',
      responseStart: aiResponse?.substring(0, 200) + '...' || 'no content'
    })

    // Debug: Show the full AI response
    console.log('📄 FULL AI RESPONSE:')
    console.log('Response Length:', aiResponse?.length || 'undefined')
    console.log('Response Content:', aiResponse || 'no content')
    console.log('======================')

    try {
      // Extract JSON from response (in case AI adds extra text)
      logger.info('🔎 Extracting JSON from AI response...')
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        logger.error('❌ No JSON found in AI response', {
          fullResponse: aiResponse
        })
        throw new ParseError('No JSON found in AI response')
      }

      const jsonString = jsonMatch[0]
      logger.info('✅ JSON extracted successfully', {
        jsonLength: jsonString.length,
        jsonStart: jsonString.substring(0, 300) + '...'
      })

      logger.info('🔄 Parsing JSON...')
      const parsedForm = JSON.parse(jsonString)
      logger.info('✅ JSON parsed successfully', {
        hasEngine: !!parsedForm.engine,
        hasSchema: !!parsedForm.schema,
        hasPages: !!parsedForm.pages,
        pageCount: parsedForm.pages?.length || 'undefined',
        topLevelKeys: Object.keys(parsedForm)
      })

      // Validate against schema
      logger.info('🔍 Validating against formDefinitionV2Schema...')

      // Debug: Log the exact structure being validated
      console.log('🔍 FORM STRUCTURE DEBUG BEFORE VALIDATION:')
      console.log('Pages count:', parsedForm.pages?.length)
      if (parsedForm.pages?.[1]) {
        console.log('Page 1 exists:', !!parsedForm.pages[1])
        console.log('Page 1 ID:', parsedForm.pages[1].id)
        console.log(
          'Page 1 components count:',
          parsedForm.pages[1].components?.length
        )
        if (parsedForm.pages[1].components?.[0]) {
          console.log(
            'Page 1 Component 0 exists:',
            !!parsedForm.pages[1].components[0]
          )
          console.log(
            'Page 1 Component 0 ID:',
            parsedForm.pages[1].components[0].id
          )
          console.log(
            'Page 1 Component 0 structure:',
            JSON.stringify(parsedForm.pages[1].components[0], null, 2)
          )
        } else {
          console.log('Page 1 Component 0 does NOT exist')
        }
      } else {
        console.log('Page 1 does NOT exist')
      }

      const { error, value } = formDefinitionV2Schema.validate(parsedForm)
      if (error) {
        logger.error('💥 VALIDATION FAILED - Full details:', {
          errorMessage: error.message,
          errorDetails: error.details,
          errorCount: error.details?.length || 0,
          fullError: JSON.stringify(error, null, 2),
          firstErrorPath: error.details?.[0]?.path?.join('.') || 'unknown',
          firstErrorMessage: error.details?.[0]?.message || 'unknown',
          parsedFormStructure: {
            engine: parsedForm.engine,
            schema: parsedForm.schema,
            hasPages: !!parsedForm.pages,
            pagesCount: parsedForm.pages?.length,
            hasConditions: !!parsedForm.conditions,
            hasLists: !!parsedForm.lists,
            hasSections: !!parsedForm.sections
          }
        })

        // Log first few validation errors with console.log for immediate visibility
        console.log('🚨 DETAILED VALIDATION ERRORS:')
        error.details?.slice(0, 5).forEach((detail, index) => {
          const errorInfo = {
            errorNumber: index + 1,
            path: detail.path?.join('.') || 'root',
            message: detail.message,
            value: detail.value,
            type: detail.type
          }
          console.log(`❌ Validation Error ${index + 1}:`, errorInfo)
          logger.error(`Validation Error ${index + 1}:`, errorInfo)
        })

        // Also log the full error structure
        console.log('🔍 Full Error Details Object:', {
          message: error.message,
          detailsCount: error.details?.length || 0,
          firstFewDetails: error.details?.slice(0, 3)
        })

        throw new ValidationError(
          'Generated form failed schema validation',
          error.details
        )
      }

      logger.info('✅ Schema validation passed!')

      logger.info('AI form successfully parsed and validated', {
        pages: value.pages?.length ?? 0,
        components: this.countComponents(value),
        conditions: value.conditions?.length ?? 0
      })

      return value
    } catch (error) {
      if (error instanceof ParseError || error instanceof ValidationError) {
        throw error
      }

      logger.error('Failed to parse AI response', { error: error.message })
      throw new ParseError(`Failed to parse AI response: ${error.message}`)
    }
  }

  /**
   * @param {Object} formDefinition
   */
  countComponents(formDefinition) {
    return (
      formDefinition.pages?.reduce(
        (total, page) => total + (page.components?.length ?? 0),
        0
      ) ?? 0
    )
  }

  /**
   * @param {Object} formDefinition
   */
  extractFormSummary(formDefinition) {
    const pages = formDefinition.pages ?? []
    const components = this.countComponents(formDefinition)
    const conditions = formDefinition.conditions?.length ?? 0
    const lists = formDefinition.lists?.length ?? 0

    return {
      pageCount: pages.length,
      componentCount: components,
      conditionCount: conditions,
      listCount: lists,
      hasConditionalLogic: conditions > 0,
      formFlow: pages.map((page) => ({
        title: page.title,
        path: page.path,
        componentCount: page.components?.length ?? 0
      }))
    }
  }
}
