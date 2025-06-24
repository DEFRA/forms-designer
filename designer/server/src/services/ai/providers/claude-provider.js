import fs from 'fs'
import path from 'path'

import Anthropic from '@anthropic-ai/sdk'
import { ComponentType, ConditionType, Coordinator } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export class ClaudeProvider {
  /**
   * @param {any} config
   * @param {any} cache
   */
  constructor(config, cache) {
    const claudeConfig = config.claude ?? config

    this.apiKey = claudeConfig.apiKey
    this.baseUrl = claudeConfig.baseUrl ?? 'https://api.anthropic.com'
    this.model = claudeConfig.model ?? 'claude-3-5-sonnet-20241022'
    this.maxTokens = claudeConfig.maxTokens ?? 8000
    this.temperature = claudeConfig.temperature ?? 0.1
    this.cache = cache

    if (!this.apiKey) {
      throw new Error('Claude API key is required')
    }

    this.client = new Anthropic({
      apiKey: this.apiKey,
      baseURL: this.baseUrl
    })

    // Load the actual JSON schemas and store as instance variables
    try {
      this.schemas = {
        formDefinitionV2: JSON.parse(
          fs.readFileSync(
            path.join(
              process.cwd(),
              '../../../model/schemas/form-definition-v2-schema.json'
            ),
            'utf8'
          )
        ),
        componentV2: JSON.parse(
          fs.readFileSync(
            path.join(
              process.cwd(),
              '../../../model/schemas/component-schema-v2.json'
            ),
            'utf8'
          )
        ),
        listV2: JSON.parse(
          fs.readFileSync(
            path.join(
              process.cwd(),
              '../../../model/schemas/list-schema-v2.json'
            ),
            'utf8'
          )
        ),
        pageV2: JSON.parse(
          fs.readFileSync(
            path.join(
              process.cwd(),
              '../../../model/schemas/page-schema-v2.json'
            ),
            'utf8'
          )
        )
      }
      logger.info('Successfully loaded V2 JSON schemas for AI validation')
    } catch (error) {
      logger.error('Failed to load V2 JSON schemas', error)
      throw new Error(
        `Schema loading failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  loadFormDefinitionJsonSchema() {
    // eslint-disable-next-line no-console
    console.log('🔧 DEBUG: loadFormDefinitionJsonSchema started')

    try {
      const schemaPath = path.resolve(
        process.cwd(),
        '../../../model/schemas/form-definition-v2-schema.json'
      )

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Schema path:', schemaPath)
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Current working directory:', process.cwd())

      if (!fs.existsSync(schemaPath)) {
        // eslint-disable-next-line no-console
        console.log('🔧 DEBUG: ERROR - Schema file not found at:', schemaPath)
        throw new Error(`Schema file not found at: ${schemaPath}`)
      }

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Schema file exists, reading...')

      const schemaContent = fs.readFileSync(schemaPath, 'utf8')
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Schema content length:', schemaContent.length)

      const parsedSchema = JSON.parse(schemaContent)

      // Remove the massive nested schemas to reduce token usage
      // Keep main structure but simplify the detailed component/list/page schemas
      if (parsedSchema.properties) {
        if (parsedSchema.properties.pages?.items) {
          parsedSchema.properties.pages.items = {
            type: 'object',
            additionalProperties: true
          }
        }
        if (parsedSchema.properties.lists?.items) {
          parsedSchema.properties.lists.items = {
            type: 'object',
            additionalProperties: true
          }
        }
        if (parsedSchema.properties.components?.items) {
          parsedSchema.properties.components.items = {
            type: 'object',
            additionalProperties: true
          }
        }
      }

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Schema parsed and simplified')
      // eslint-disable-next-line no-console
      console.log(
        '🔧 DEBUG: Simplified schema content length:',
        JSON.stringify(parsedSchema).length
      )

      return parsedSchema
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: ERROR in loadFormDefinitionJsonSchema:', error)
      logger.error('Failed to load form definition schema', error)
      throw new Error(
        `Schema loading failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  loadIndividualSchema(/** @type {string} */ schemaFileName) {
    // eslint-disable-next-line no-console
    console.log('🔧 DEBUG: loadIndividualSchema started for:', schemaFileName)

    try {
      const schemaPath = path.resolve(
        process.cwd(),
        `../../../model/schemas/${schemaFileName}`
      )

      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found at: ${schemaPath}`)
      }

      const schemaContent = fs.readFileSync(schemaPath, 'utf8')
      const parsedSchema = JSON.parse(schemaContent)

      // eslint-disable-next-line no-console
      console.log(
        '🔧 DEBUG: Individual schema loaded:',
        schemaFileName,
        'size:',
        JSON.stringify(parsedSchema).length
      )

      return parsedSchema
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: ERROR in loadIndividualSchema:', error)
      logger.error(`Failed to load ${schemaFileName}`, error)
      throw new Error(
        `Schema loading failed for ${schemaFileName}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  createAgenticTools() {
    // eslint-disable-next-line no-console
    console.log('🔧 DEBUG: createAgenticTools started')

    let _formSchema, _componentSchema, _pageSchema, _listSchema

    try {
      _formSchema = this.loadFormDefinitionJsonSchema()
      _componentSchema = this.loadIndividualSchema('component-schema-v2.json')
      _pageSchema = this.loadIndividualSchema('page-schema-v2.json')
      _listSchema = this.loadIndividualSchema('list-schema-v2.json')
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: All schemas loaded successfully')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: ERROR loading schemas:', error)
      throw error
    }

    return [
      {
        name: 'analyze_form_requirements',
        description:
          'Analyze user requirements and create a structured plan for form generation. Use this first to understand what type of form is needed.',
        input_schema: {
          type: 'object',
          properties: {
            user_description: {
              type: 'string',
              description: "The user's description of their form needs"
            },
            complexity_assessment: {
              type: 'string',
              enum: ['simple', 'moderate', 'complex'],
              description: 'Your assessment of the form complexity'
            },
            recommended_strategy: {
              type: 'string',
              description: 'Your recommended approach for building this form'
            },
            key_components_needed: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of key form components that will be needed'
            }
          },
          required: [
            'user_description',
            'complexity_assessment',
            'recommended_strategy',
            'key_components_needed'
          ]
        }
      },
      {
        name: 'generate_form_structure',
        description:
          'Generate the basic structure and pages for the form based on your analysis. Use the complete page v2 schema for proper structure.',
        input_schema: {
          type: 'object',
          properties: {
            form_metadata: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                purpose: { type: 'string' }
              },
              required: ['title']
            },
            pages_structure: {
              type: 'array',
              items: _pageSchema
            }
          },
          required: ['form_metadata', 'pages_structure']
        }
      },
      {
        name: 'design_form_lists',
        description:
          'Design reusable lists for dropdown, radio, and checkbox components. Use the complete list v2 schema for proper validation.',
        input_schema: {
          type: 'object',
          properties: {
            lists: {
              type: 'array',
              items: _listSchema,
              description: 'Array of list definitions for form components'
            }
          },
          required: ['lists']
        }
      },
      {
        name: 'design_form_components',
        description:
          'Design specific form components and fields for each page. Use the complete component v2 schema for proper validation.',
        input_schema: {
          type: 'object',
          properties: {
            page_path: {
              type: 'string',
              description: 'The path of the page to add components to'
            },
            components: {
              type: 'array',
              items: _componentSchema
            }
          },
          required: ['page_path', 'components']
        }
      },
      {
        name: 'validate_form_logic',
        description:
          'Validate the logical flow and consistency of the form design using the complete form schema.',
        input_schema: {
          type: 'object',
          properties: {
            validation_type: {
              type: 'string',
              enum: ['structure', 'logic', 'accessibility', 'usability'],
              description: 'Type of validation to perform'
            },
            current_form: _formSchema,
            issues_found: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  severity: {
                    type: 'string',
                    enum: ['error', 'warning', 'suggestion']
                  },
                  message: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          },
          required: ['validation_type', 'current_form']
        }
      },
      {
        name: 'refine_form_design',
        description:
          'Refine and improve the form based on validation feedback.',
        input_schema: {
          type: 'object',
          properties: {
            refinement_type: {
              type: 'string',
              enum: [
                'fix_errors',
                'improve_usability',
                'enhance_accessibility',
                'optimize_flow'
              ],
              description: 'Type of refinement to apply'
            },
            target_issues: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific issues to address'
            },
            improvements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  location: { type: 'string' },
                  change: { type: 'string' },
                  reason: { type: 'string' }
                }
              }
            }
          },
          required: ['refinement_type', 'improvements']
        }
      },
      {
        name: 'finalize_form_definition',
        description:
          'Generate the final complete FormDefinitionV2 JSON structure. Use this only when you are satisfied with the form design.',
        input_schema: _formSchema
      }
    ]
  }

  /**
   * @param {string} prompt
   * @param {string} sessionId
   * @param {import('./ai-provider-interface.js').FormPreferences} preferences
   */
  async generateFormAgentic(prompt, sessionId, preferences = {}) {
    // eslint-disable-next-line no-console
    console.log('🔧 DEBUG: generateFormAgentic started')
    // eslint-disable-next-line no-console
    console.log('🔧 DEBUG: prompt:', prompt)

    try {
      const cacheKey = `claude-agentic-${Buffer.from(prompt).toString('base64').slice(0, 50)}`

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Cache key:', cacheKey)

      // Temporarily disable cache to avoid stale data issues during debugging
      // const cached = await this.cache.get(cacheKey)
      // if (cached) {
      //   console.log('🔧 DEBUG: Using cached result')
      //   logger.info('Using cached agentic form generation result')
      //   return cached
      // }

      // eslint-disable-next-line no-console
      console.log(
        '🔧 DEBUG: Generating fresh form (cache disabled for debugging)'
      )

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Creating agentic tools')
      const tools = this.createAgenticTools()
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Tools created, count:', tools.length)

      const systemPrompt = `You are an expert UK government form designer AI with autonomous decision-making capabilities.

🚨 CRITICAL V2 FORM VALIDATION RULES 🚨:

## VALID COMPONENT TYPES (use EXACTLY these):
${Object.values(ComponentType)
  .map((type) => `- "${type}"`)
  .join('\n')}

## VALID CONDITION TYPES:
${Object.values(ConditionType)
  .map((type) => `- "${type}"`)
  .join('\n')}

## VALID COORDINATORS:
${Object.values(Coordinator)
  .map((coord) => `- "${coord}" (lowercase!)`)
  .join('\n')}

🎯 CRITICAL VALIDATION REQUIREMENTS:
1. **Engine Field**: ALWAYS include "engine": "V2" at root level
2. **Schema Field**: ALWAYS include "schema": 2 
3. **UUID Fields**: ALL "id" fields MUST be valid UUID v4 format (8-4-4-4-12 hex digits)
4. **Component Types**: Use ONLY exact types above (NO "DateField" - use "DatePartsField"!)
5. **Component Names**: Must be valid JavaScript identifiers (letters only)
6. **Component Titles**: Must never be empty - provide meaningful titles
7. **List References**: Components with "list" property MUST reference list.id (UUID), NOT list.name
8. **Condition Types**: Use specific types based on value:
   - Boolean values → "BooleanValue" 
   - String values → "StringValue"
   - Number values → "NumberValue"
   - Date values → "DateValue"
   - List selections → "ListItemRef"
9. **Coordinator Values**: Use lowercase "and"/"or" NOT uppercase "AND"/"OR"

🔧 EXAMPLES OF CORRECT STRUCTURES:

Component with List Reference (CORRECT):
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "type": "RadiosField",
  "name": "dogBreed",
  "title": "What breed is your dog?",
  "list": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "options": {"required": true},
  "schema": {}
}

Condition with Boolean Value (CORRECT):
{
  "id": "condition-uuid",
  "componentId": "component-uuid",
  "operator": "is",
  "type": "BooleanValue",
  "value": true
}

Condition Wrapper (CORRECT):
{
  "id": "wrapper-uuid",
  "displayName": "Skip if no incidents",
  "coordinator": "and",
  "items": [...]
}

When generating forms, these rules will be validated before finalization.`

      // Build the user message
      let userMessage = `Create a form based on this description: ${prompt}

Start by analyzing the requirements using the analyze_form_requirements tool.`

      if (preferences.refinementContext) {
        userMessage += `\n\nIMPORTANT: The previous attempt failed. ${preferences.refinementContext}`
      }

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Starting conversation loop')

      // Initialize conversation
      const messages = /** @type {any[]} */ ([
        {
          role: 'user',
          content: userMessage
        }
      ])

      const workflowSteps = []
      let formDefinition = null
      let totalInputTokens = 0
      let totalOutputTokens = 0
      let conversationTurn = 0
      let refinementAttempts = 0
      const maxTurns = 20 // Allow more turns for validation refinement
      const maxRefinements = 5 // Maximum refinement attempts

      // Multi-turn conversation loop
      while (conversationTurn < maxTurns && !formDefinition) {
        conversationTurn++
        // eslint-disable-next-line no-console
        console.log(`🔧 DEBUG: Conversation turn ${conversationTurn}`)

        try {
          const response = await this.client.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            system: systemPrompt,
            messages,
            tools
          })

          // eslint-disable-next-line no-console
          console.log(`🔧 DEBUG: Turn ${conversationTurn} response received`)

          totalInputTokens += response.usage.input_tokens
          totalOutputTokens += response.usage.output_tokens

          // Add assistant's response to conversation
          messages.push({
            role: 'assistant',
            content: response.content
          })

          const toolUses = response.content.filter(
            /** @param {any} block */ (block) => block.type === 'tool_use'
          )

          // eslint-disable-next-line no-console
          console.log(
            `🔧 DEBUG: Turn ${conversationTurn} - Tool uses found:`,
            toolUses.length
          )

          if (toolUses.length === 0) {
            // eslint-disable-next-line no-console
            console.log('🔧 DEBUG: No tool uses found, prompting to continue')

            // Prompt AI to continue with next step
            messages.push({
              role: 'user',
              content:
                'Please continue with the next step in your workflow. If you have completed the analysis, proceed to generate_form_structure. When you have fully designed the form, call finalize_form_definition.'
            })
            continue
          }

          // Process each tool use (usually just one per turn)
          const toolResults = /** @type {any[]} */ ([])

          for (const toolUse of toolUses) {
            if (toolUse.type === 'tool_use') {
              // eslint-disable-next-line no-console
              console.log(
                `🔧 DEBUG: Turn ${conversationTurn} - Processing tool:`,
                toolUse.name
              )

              const stepNumber = workflowSteps.length + 1
              const workflowStep = /** @type {any} */ ({
                tool: toolUse.name,
                input: toolUse.input,
                step: stepNumber,
                timestamp: new Date().toISOString(),
                turn: conversationTurn
              })

              workflowSteps.push(workflowStep)

              logger.info(`AI Tool Usage - Step ${stepNumber}: ${toolUse.name}`)

              const inputSummary = this.summarizeToolInput(
                toolUse.name,
                toolUse.input
              )
              logger.info(`AI Tool Input - ${toolUse.name}: ${inputSummary}`)

              // Check if this is the finalize tool
              if (toolUse.name === 'finalize_form_definition') {
                // eslint-disable-next-line no-console
                console.log(
                  '🔧 DEBUG: Found finalize_form_definition - validating form...'
                )

                const candidateForm = toolUse.input

                // Validate the form using the same validation logic as FormGeneratorService
                const validationResult =
                  await this.validateFormDefinition(candidateForm)

                if (validationResult.isValid) {
                  // eslint-disable-next-line no-console
                  console.log(
                    '🔧 DEBUG: Form validation passed - workflow complete!'
                  )
                  // Use the VALIDATED and CLEANED form definition (with unknown properties stripped)
                  formDefinition =
                    validationResult.validatedForm ?? candidateForm
                  logger.info(
                    'AI Workflow Complete - Form definition finalized and validated'
                  )

                  // Add successful result
                  toolResults.push({
                    tool_use_id: toolUse.id,
                    type: 'tool_result',
                    content:
                      'Form definition finalized and validated successfully! The form has been generated.'
                  })

                  break
                } else {
                  // eslint-disable-next-line no-console
                  console.log(
                    '🔧 DEBUG: Form validation failed, prompting refinement...'
                  )

                  if (refinementAttempts >= maxRefinements) {
                    // eslint-disable-next-line no-console
                    console.log(
                      '🔧 DEBUG: Max refinement attempts reached, accepting current form'
                    )
                    formDefinition = candidateForm

                    toolResults.push({
                      tool_use_id: toolUse.id,
                      type: 'tool_result',
                      content:
                        'Form definition finalized (with validation warnings). Maximum refinement attempts reached.'
                    })
                    break
                  }

                  refinementAttempts++
                  const errorDetails = this.formatValidationErrors(
                    validationResult.errors
                  )

                  // eslint-disable-next-line no-console
                  console.log('🔧 DEBUG: Validation errors:', errorDetails)

                  toolResults.push({
                    tool_use_id: toolUse.id,
                    type: 'tool_result',
                    content: `Form validation failed with the following errors:\n\n${errorDetails}\n\nPlease use the refine_form_design tool to fix these validation errors. Pay special attention to:\n- Missing or empty component titles\n- Missing list references for SelectField/RadiosField/CheckboxesField components\n- Missing or invalid UUIDs (must be proper UUID v4 format)\n- Ensure all lists referenced by components exist in the form's lists array`
                  })
                }
              } else {
                // For other tools, provide encouraging feedback to continue
                let toolResult = ''

                switch (toolUse.name) {
                  case 'analyze_form_requirements': {
                    const input = /** @type {any} */ (toolUse.input)
                    toolResult = `Analysis complete. You assessed this as a ${input.complexity_assessment} form. Next step: Call generate_form_structure to plan the pages and flow.`
                    break
                  }
                  case 'generate_form_structure': {
                    const input = /** @type {any} */ (toolUse.input)
                    const pageCount = input.pages_structure?.length ?? 0
                    toolResult = `Form structure created with ${pageCount} pages. Next step: Call design_form_lists to create any needed lists for dropdowns/radios/checkboxes, then design_form_components for each page.`
                    break
                  }
                  case 'design_form_lists': {
                    const input = /** @type {any} */ (toolUse.input)
                    const listCount = input.lists?.length ?? 0
                    toolResult = `Created ${listCount} form lists. Next step: Call design_form_components to create fields for each page, starting with the first page.`
                    break
                  }
                  case 'design_form_components': {
                    const input = /** @type {any} */ (toolUse.input)
                    const componentCount = input.components?.length ?? 0
                    toolResult = `Designed ${componentCount} components for page "${input.page_path}". Next: Continue with design_form_components for other pages, or if all pages are complete, call validate_form_logic.`
                    break
                  }
                  case 'validate_form_logic': {
                    const input = /** @type {any} */ (toolUse.input)
                    const issues = input.issues_found?.length ?? 0
                    if (issues > 0) {
                      toolResult = `Validation found ${issues} issues. Next step: Call refine_form_design to fix these issues.`
                    } else {
                      toolResult = `Validation passed with no issues found. Next step: Call finalize_form_definition to complete the form.`
                    }
                    break
                  }
                  case 'refine_form_design': {
                    toolResult =
                      'Refinements applied successfully. Next step: Call finalize_form_definition to complete and validate the form.'
                    break
                  }
                  default: {
                    toolResult =
                      'Tool executed successfully. Continue with the next step in your workflow following the systematic approach.'
                  }
                }

                toolResults.push({
                  tool_use_id: toolUse.id,
                  type: 'tool_result',
                  content: toolResult
                })
              }
            }
          }

          // If we found the final form definition, break out of the loop
          if (formDefinition) {
            break
          }

          // Add tool results back to conversation to continue the flow
          if (toolResults.length > 0) {
            messages.push({
              role: 'user',
              content: /** @type {any} */ (toolResults)
            })
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(
            `🔧 DEBUG: Error in turn ${conversationTurn}:`,
            error instanceof Error ? error.message : String(error)
          )
          throw error
        }
      }

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Conversation loop completed')
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Total turns:', conversationTurn)
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Refinement attempts:', refinementAttempts)
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: formDefinition exists:', !!formDefinition)
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: workflowSteps count:', workflowSteps.length)

      if (!formDefinition) {
        // eslint-disable-next-line no-console
        console.log(
          `🔧 DEBUG: ERROR - No final form definition after ${conversationTurn} turns`
        )
        // eslint-disable-next-line no-console
        console.log(
          '🔧 DEBUG: Tools used:',
          workflowSteps.map((s) => s.tool)
        )
        throw new Error(
          `Form generation incomplete after ${conversationTurn} conversation turns - finalize_form_definition not called`
        )
      }

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Building final result')

      const result = {
        content: JSON.stringify(formDefinition, null, 2),
        formDefinition,
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens
        },
        model: this.model,
        workflowSteps,
        agenticApproach: true,
        conversationTurns: conversationTurn,
        refinementAttempts
      }

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: Final form definition structure:')
      // eslint-disable-next-line no-console
      console.log(
        '🔧 DEBUG: Form definition keys:',
        Object.keys(formDefinition)
      )

      if (typeof formDefinition === 'object') {
        const formDef = /** @type {any} */ (formDefinition)
        // eslint-disable-next-line no-console
        console.log(
          '🔧 DEBUG: Form definition pages count:',
          formDef.pages?.length
        )
        // eslint-disable-next-line no-console
        console.log('🔧 DEBUG: Form definition has name:', 'name' in formDef)
        // eslint-disable-next-line no-console
        console.log(
          '🔧 DEBUG: Form definition has schema:',
          'schema' in formDef
        )
        // eslint-disable-next-line no-console
        console.log(
          '🔧 DEBUG: Form definition has engine:',
          'engine' in formDef
        )
      }

      await this.cache.set(cacheKey, result, 3600)

      // Log comprehensive workflow summary
      logger.info('=== AI AGENTIC WORKFLOW COMPLETE ===')
      logger.info(`Total autonomous steps: ${workflowSteps.length}`)
      logger.info(`Conversation turns: ${conversationTurn}`)
      logger.info(`Refinement attempts: ${refinementAttempts}`)
      logger.info(
        `Workflow tools used: ${workflowSteps.map((step) => step.tool).join(' → ')}`
      )
      logger.info(
        `Token usage - Input: ${result.usage.inputTokens}, Output: ${result.usage.outputTokens}, Total: ${Number(result.usage.inputTokens) + Number(result.usage.outputTokens)}`
      )

      // Log form generation results
      const pageCount =
        /** @type {any} */ (result.formDefinition).pages?.length ?? 0
      const totalComponents =
        /** @type {any} */ (result.formDefinition).pages?.reduce(
          (/** @type {number} */ total, /** @type {any} */ page) =>
            total + Number(page.components?.length ?? 0),
          0
        ) ?? 0
      logger.info(
        `Generated form - Pages: ${pageCount}, Components: ${totalComponents}`
      )
      logger.info('Agentic form generation completed successfully')

      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: generateFormAgentic completed successfully')

      return result
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🔧 DEBUG: ERROR in generateFormAgentic:', error)

      logger.error('Agentic form generation failed', error)
      throw error
    }
  }

  /**
   * Summarize tool input for logging purposes
   * @param {string} toolName
   * @param {any} input
   * @returns {string}
   */
  summarizeToolInput(toolName, input) {
    try {
      switch (toolName) {
        case 'analyze_form_requirements':
          return `Analysis: ${input.complexity_assessment ?? 'unknown'} complexity`
        case 'generate_form_structure':
          return `Structure: ${input.pages_structure?.length ?? 0} pages`
        case 'design_form_lists':
          return `Lists: ${input.lists?.length ?? 0} list definitions`
        case 'design_form_components':
          return `Components: ${input.components?.length ?? 0} fields for ${input.page_path}`
        case 'validate_form_logic':
          return `Validation: ${input.validation_type} check`
        case 'refine_form_design':
          return `Refinement: ${input.refinement_type}`
        case 'finalize_form_definition': {
          const pageCount = input.pages?.length ?? 0
          const componentCount =
            input.pages?.reduce(
              (/** @type {number} */ total, /** @type {any} */ page) =>
                total + Number(page.components?.length ?? 0),
              0
            ) ?? 0
          return `Final form: ${pageCount} pages, ${componentCount} components`
        }
        default:
          return 'Tool input processed'
      }
    } catch {
      return 'Input summary unavailable'
    }
  }

  /**
   * @param {string} prompt
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
   * Validates form definition using the EXACT same logic as forms manager API
   * @param {any} formDefinition
   * @returns {Promise<{isValid: boolean, errors: Array<any>, validatedForm?: any}>}
   */
  async validateFormDefinition(formDefinition) {
    try {
      const { formDefinitionV2Schema } = await import('@defra/forms-model')

      // Use EXACT same validation options as forms manager API (/api/{id}/data route)
      const result = formDefinitionV2Schema.validate(formDefinition, {
        abortEarly: false,
        stripUnknown: true // CRITICAL: Strip unknown properties like forms manager does
      })

      if (result.error) {
        const errors = result.error.details.map((detail) => ({
          type: 'schema_error',
          path: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))

        return { isValid: false, errors }
      }

      // Return both validation result AND the cleaned/validated form
      return { isValid: true, errors: [], validatedForm: result.value }
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            type: 'validation_error',
            message: error instanceof Error ? error.message : String(error)
          }
        ]
      }
    }
  }

  /**
   * Formats validation errors for Claude to understand and fix
   * @param {Array<any>} errors
   * @returns {string}
   */
  formatValidationErrors(errors) {
    return errors
      .map((error, index) => {
        if (error.path) {
          return `${index + 1}. Path: ${error.path} - ${error.message}`
        }
        return `${index + 1}. ${error.message}`
      })
      .join('\n')
  }
}

/**
 * @import { AIProviderConfig, IRateLimiter, ICache } from '~/src/services/ai/types.js'
 */
