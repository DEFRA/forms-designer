import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import Anthropic from '@anthropic-ai/sdk'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { IAIProvider } from '~/src/services/ai/providers/ai-provider-interface.js'

const logger = createLogger()

export class AIProviderError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode = 500) {
    super(message)
    this.name = 'AIProviderError'
    this.statusCode = statusCode
  }
}

export class ClaudeAIProvider extends IAIProvider {
  /**
   * @param {AIProviderConfig} config
   * @param {IRateLimiter} rateLimiter
   * @param {ICache} cache
   */
  constructor(config, rateLimiter, cache) {
    super()
    this.config = config
    this.rateLimiter = rateLimiter
    this.cache = cache

    if (!config.apiKey) {
      throw new Error('Claude API key is required')
    }

    this.client = new Anthropic({
      apiKey: config.apiKey
    })
  }

  /**
   * Create a simplified but accurate JSON Schema for FormDefinitionV2
   * Based on the actual Joi schema but simplified for tool calling
   * @returns {object} JSON Schema for FormDefinitionV2
   */
  loadFormDefinitionJsonSchema() {
    try {
      const currentDir = path.dirname(fileURLToPath(import.meta.url))

      const schemaPath = path.resolve(
        process.cwd(),
        '../../../model/schemas/form-definition-v2-schema.json'
      )

      let foundPath = null

      if (!fs.existsSync(schemaPath)) {
        const schemaDir = path.dirname(schemaPath)

        if (fs.existsSync(schemaDir)) {
          try {
            const files = fs.readdirSync(schemaDir)
            logger.debug('Schema directory contents', { files })
          } catch (err) {
            logger.debug('Error reading schema directory', {
              error: err instanceof Error ? err.message : String(err)
            })
          }
        }

        const alternativePaths = [
          path.resolve(
            process.cwd(),
            '../../../model/schemas/form-definition-v2-schema.json'
          ),
          path.resolve(
            process.cwd(),
            '../../model/schemas/form-definition-v2-schema.json'
          ),
          path.resolve(
            process.cwd(),
            '../model/schemas/form-definition-v2-schema.json'
          ),
          path.resolve(
            process.cwd(),
            'model/schemas/form-definition-v2-schema.json'
          ),
          path.resolve(process.cwd(), 'schemas/form-definition-v2-schema.json')
        ]

        for (const altPath of alternativePaths) {
          if (fs.existsSync(altPath)) {
            foundPath = altPath
            break
          }
        }

        if (!foundPath) {
          const morePaths = [
            path.resolve(
              currentDir,
              '../../../../node_modules/@defra/forms-model/schemas/form-definition-v2-schema.json'
            ),
            path.resolve(
              currentDir,
              '../../../node_modules/@defra/forms-model/schemas/form-definition-v2-schema.json'
            ),
            path.resolve(
              process.cwd(),
              'node_modules/@defra/forms-model/schemas/form-definition-v2-schema.json'
            ),
            path.resolve(
              process.cwd(),
              'model/schemas/form-definition-v2-schema.json'
            ),
            path.resolve(
              process.cwd(),
              'forms-designer/model/schemas/form-definition-v2-schema.json'
            )
          ]

          for (const altPath of morePaths) {
            if (fs.existsSync(altPath)) {
              foundPath = altPath
              break
            }
          }
        }

        if (!foundPath) {
          logger.warn(
            'Generated schema not found, using fallback minimal schema'
          )
          return this.getFallbackSchema()
        }
      }

      const finalPath = foundPath ?? schemaPath
      const schemaContent = fs.readFileSync(finalPath, 'utf8')
      const schema = JSON.parse(schemaContent)

      schema.type ??= 'object'
      schema.required ??= ['engine', 'schema', 'pages', 'sections']

      logger.info('Loaded complete FormDefinitionV2 schema for AI', {
        schemaSize: schemaContent.length,
        hasTitle: !!schema.title,
        hasDescription: !!schema.description,
        hasType: !!schema.type,
        hasRequired: !!schema.required
      })

      return schema
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error('Failed to load generated schema, using fallback', {
        error: errorMessage
      })
      return this.getFallbackSchema()
    }
  }

  /**
   * Fallback minimal schema if generated schema cannot be loaded
   * @returns {object} Minimal JSON Schema for FormDefinitionV2
   */
  getFallbackSchema() {
    return {
      type: 'object',
      required: ['engine', 'schema', 'pages', 'sections'],
      properties: {
        engine: {
          type: 'string',
          enum: ['V2'],
          description: 'Form engine version - must be V2'
        },
        schema: {
          type: 'integer',
          const: 2,
          description: 'Schema version - must be 2'
        },
        pages: {
          type: 'array',
          minItems: 1,
          description: 'Array of form pages - at least one required',
          items: {
            type: 'object',
            required: ['id', 'title', 'path', 'section', 'components', 'next'],
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique UUID for the page'
              },
              title: {
                type: 'string',
                description: 'Page title - can be empty string for V2'
              },
              path: {
                type: 'string',
                pattern: '^/',
                description: 'URL path starting with /'
              },
              section: {
                type: 'string',
                description: 'Section name this page belongs to'
              },
              components: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'type'],
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                      description: 'Unique UUID for the component'
                    },
                    type: {
                      type: 'string',
                      enum: [
                        'TextField',
                        'EmailField',
                        'TelephoneField',
                        'NumberField',
                        'MultilineTextField',
                        'SelectField',
                        'RadiosField',
                        'CheckboxesField',
                        'DateField',
                        'TimeField',
                        'DateTimeField',
                        'YesNoField',
                        'UkAddressField',
                        'FileUploadField',
                        'Html',
                        'InsetText',
                        'Details',
                        'List'
                      ],
                      description: 'Component type'
                    },
                    name: {
                      type: 'string',
                      pattern: '^[a-zA-Z][a-zA-Z0-9]*$',
                      description:
                        'Component name for data binding (required for input components)'
                    },
                    title: {
                      type: 'string',
                      minLength: 1,
                      description:
                        'Component title - REQUIRED and cannot be empty. Must be a meaningful question or label.'
                    },
                    hint: {
                      type: 'string',
                      description: 'Hint text for the component'
                    },
                    options: {
                      type: 'object',
                      description: 'Component-specific options'
                    },
                    schema: {
                      type: 'object',
                      description: 'Validation schema'
                    },
                    list: {
                      type: 'string',
                      format: 'uuid',
                      description:
                        'REQUIRED for SelectField, RadiosField, CheckboxesField - must reference an existing list ID'
                    }
                  }
                }
              },
              next: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['path'],
                  properties: {
                    path: {
                      type: 'string',
                      description: 'Next page path'
                    },
                    condition: {
                      type: 'string',
                      description: 'Optional condition ID'
                    }
                  }
                }
              },
              controller: {
                type: 'string',
                description: 'Optional controller type'
              },
              condition: {
                type: 'string',
                description: 'Optional condition ID for showing this page'
              }
            }
          }
        },
        sections: {
          type: 'array',
          minItems: 1,
          description: 'Form sections - at least one required',
          items: {
            type: 'object',
            required: ['name', 'title'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                description: 'Unique section identifier'
              },
              title: {
                type: 'string',
                minLength: 1,
                description: 'Section display title'
              }
            }
          }
        },
        lists: {
          type: 'array',
          description: 'Optional lists for select components',
          items: {
            type: 'object',
            required: ['id', 'name', 'title', 'type', 'items'],
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique UUID for the list'
              },
              name: {
                type: 'string',
                description: 'List name'
              },
              title: {
                type: 'string',
                description: 'List title'
              },
              type: {
                type: 'string',
                enum: ['string', 'number'],
                description: 'List item value type'
              },
              items: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['id', 'text', 'value'],
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                      description: 'Unique UUID for the list item'
                    },
                    text: {
                      type: 'string',
                      description: 'Display text'
                    },
                    value: {
                      type: ['string', 'number'],
                      description: 'Value when selected'
                    }
                  }
                }
              }
            }
          }
        },
        conditions: {
          type: 'array',
          description: 'Optional conditions for form logic',
          items: {
            type: 'object',
            required: ['id', 'displayName', 'coordinator', 'items'],
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique UUID for the condition'
              },
              displayName: {
                type: 'string',
                description: 'Human readable condition name'
              },
              coordinator: {
                type: 'string',
                enum: ['and', 'or'],
                description: 'Logical coordinator'
              },
              items: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['id', 'componentId', 'operator', 'type', 'value'],
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                      description: 'Unique UUID for the condition item'
                    },
                    componentId: {
                      type: 'string',
                      description: 'Reference to component ID'
                    },
                    operator: {
                      type: 'string',
                      enum: [
                        'is',
                        'is not',
                        'contains',
                        'does not contain',
                        'is greater than',
                        'is less than'
                      ],
                      description: 'Comparison operator'
                    },
                    type: {
                      type: 'string',
                      enum: [
                        'StringValue',
                        'NumberValue',
                        'BooleanValue',
                        'ListItemRef'
                      ],
                      description: 'Value type'
                    },
                    value: {
                      description: 'Value to compare against'
                    }
                  }
                }
              }
            }
          }
        },
        feedback: {
          type: 'object',
          description: 'Optional feedback configuration',
          properties: {
            feedbackForm: {
              type: 'boolean',
              description: 'Whether to show built-in feedback form'
            },
            emailAddress: {
              type: 'string',
              format: 'email',
              description: 'Email for feedback submissions'
            }
          }
        },
        phaseBanner: {
          type: 'object',
          description: 'Optional phase banner configuration',
          properties: {
            phase: {
              type: 'string',
              enum: ['alpha', 'beta'],
              description:
                'Service phase - ONLY phase property allowed, no feedbackUrl'
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }
  }

  /**
   * Generate form using modern tool calling approach
   * @param {string} prompt - The prompt for form generation
   * @returns {Promise<import('../types.js').AIResponse>} - Response with structured form data
   */
  async generate(prompt) {
    logger.info('ClaudeAIProvider.generate() called with TOOL CALLING')

    logger.info('Checking rate limit...')
    try {
      this.rateLimiter.checkLimit('default')
      logger.info('Rate limit check passed')
    } catch (error) {
      logger.warn('Rate limit exceeded', {
        error: error instanceof Error ? error.message : String(error)
      })
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    logger.info('Checking cache...')
    const cacheKey = `claude_response_${prompt.slice(0, 100)}_${Date.now()}`
    const cachedResult = await this.cache.get(cacheKey)

    if (cachedResult) {
      logger.info('Cache hit, returning cached result')
      return cachedResult
    }
    logger.info('No cache hit, proceeding with API call')

    const formDefinitionJsonSchema = this.loadFormDefinitionJsonSchema()

    const toolSchema = {
      type: /** @type {'object'} */ ('object'),
      ...formDefinitionJsonSchema
    }

    const formGenerationTool = {
      name: 'generate_form_definition',
      description:
        'Generate a complete FormDefinitionV2 JSON structure for a UK government digital service form. Must include all required fields with proper UUIDs and follow exact schema validation rules.',
      input_schema: toolSchema
    }

    logger.info('Calling Claude API with TOOL CALLING approach...')

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        tools: [formGenerationTool],
        tool_choice: { type: 'tool', name: 'generate_form_definition' },
        messages: [
          {
            role: 'user',
            content: `You are an expert UK government form designer. You MUST generate valid FormDefinitionV2 structures that pass strict validation:

🚨 CRITICAL UUID GENERATION RULES 🚨:
1. EVERY "id" field MUST be a valid UUID v4 (8-4-4-4-12 hex digit format)
2. Generate unique UUIDs like: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
3. NEVER use undefined, null, empty strings, or descriptive names for "id" fields
4. Required UUID fields: pages[].id, components[].id, lists[].id, lists[].items[].id, conditions[].id, conditions[].items[].id

CRITICAL VALIDATION RULES:
1. ALL component "title" fields MUST be non-empty meaningful questions/labels
2. SelectField, RadiosField, CheckboxesField components MUST have "list" property referencing a list ID
3. List references MUST point to existing lists in the same form
4. Component "name" fields must be valid JavaScript identifiers
5. Generate completely unique UUIDs for every single "id" field - no duplicates

${prompt}`
          }
        ]
      })

      const contentBlock = response.content?.[0]

      if (
        contentBlock?.type === 'tool_use' &&
        contentBlock.name === 'generate_form_definition'
      ) {
        const formDefinition = /** @type {object} */ (contentBlock.input)

        const result = {
          content: JSON.stringify(formDefinition, null, 2),
          formDefinition,
          usage: {
            inputTokens: response.usage?.input_tokens ?? 0,
            outputTokens: response.usage?.output_tokens ?? 0
          },
          model: response.model
        }

        await this.cache.set(cacheKey, result, 3600)

        logger.info('Claude TOOL CALLING completed successfully!')
        logger.info('Form definition extracted from tool use')

        return result
      } else {
        throw new Error('Unexpected response format from Claude API')
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        logger.error('Claude tool calling failed', {
          status: error.status,
          message: error.message,
          requestId: error.headers?.['request-id']
        })

        throw new Error(
          `Claude API error: ${error.message} (status: ${error.status})`
        )
      }

      logger.error('Claude tool calling failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })

      throw new Error(
        `AI generation failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * @param {string} prompt
   * @returns {boolean}
   */
  validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return false
    }

    if (prompt.length < 10 || prompt.length > 50000) {
      return false
    }

    return true
  }

  /**
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async generateCacheKey(prompt) {
    const { createHash } = await import('crypto')
    return `claude:${createHash('sha256').update(prompt).digest('hex')}`
  }
}

/**
 * @import { AIProviderConfig, IRateLimiter, ICache } from '~/src/services/ai/types.js'
 */
