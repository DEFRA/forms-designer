import fs from 'fs'
import path from 'path'

import Anthropic from '@anthropic-ai/sdk'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import { ResponseParser } from '~/src/services/ai/response-parser.js'

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
    this.useDirectGeneration = claudeConfig.useDirectGeneration ?? false
    this.cache = cache

    if (!this.apiKey) {
      throw new Error('Claude API key is required')
    }

    this.client = new Anthropic({
      apiKey: this.apiKey,
      baseURL: this.baseUrl
    })

    // Initialize prompt builder and validation services
    this.promptBuilder = new PromptBuilder()
    this.responseParser = new ResponseParser()
    this.formValidator = new AIFormValidator()
  }

  loadFormDefinitionJsonSchema() {
    try {
      const schemaPath = path.resolve(
        process.cwd(),
        '../../../model/schemas/form-definition-v2-schema.json'
      )

      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found at: ${schemaPath}`)
      }

      const schemaContent = fs.readFileSync(schemaPath, 'utf8')

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

      return parsedSchema
    } catch (error) {
      logger.error('Failed to load form definition schema', error)
      throw new Error(
        `Schema loading failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  loadIndividualSchema(/** @type {string} */ schemaFileName) {
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

      return parsedSchema
    } catch (error) {
      logger.error(`Failed to load ${schemaFileName}`, error)
      throw new Error(
        `Schema loading failed for ${schemaFileName}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  createAgenticTools() {
    const formSchema = this.loadFormDefinitionJsonSchema()
    const componentSchema = this.loadIndividualSchema(
      'component-schema-v2.json'
    )
    const pageSchema = this.loadIndividualSchema('page-schema-v2.json')
    const listSchema = this.loadIndividualSchema('list-schema-v2.json')

    return [
      {
        name: 'analyse_form_requirements',
        description:
          'Analyse user requirements and create a structured plan for form generation. Use this first to understand what type of form is needed.',
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
              items: pageSchema
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
              items: listSchema,
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
              items: componentSchema
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
            current_form: formSchema,
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
        name: 'finalise_form_definition',
        description:
          'Generate the final complete FormDefinitionV2 JSON structure. Use this only when you are satisfied with the form design.',
        input_schema: formSchema
      }
    ]
  }

  /**
   * Basic generate method for simple prompts
   * @param {string} prompt - The prompt to send to Claude
   * @returns {Promise<{content: string, usage: object}>}
   */
  async generate(prompt) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const firstContent = response.content[0]
      if (firstContent.type !== 'text') {
        throw new Error('No valid text content found in AI response')
      }

      return {
        content: firstContent.text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens
        }
      }
    } catch (error) {
      logger.error('Basic generation failed:', error)
      throw error
    }
  }

  /**
   * Generate form using direct single-shot approach
   * @param {string} description - The form description
   * @param {string} _title - The form title
   * @param {Function} updateProgress - Progress callback function
   * @returns {Promise<any>} - The generated form definition
   */
  async generateFormDirect(description, _title, updateProgress) {
    try {
      await updateProgress('generation', 'Creating your form with AI...', {
        step: 1
      })

      const formSchema = this.loadFormDefinitionJsonSchema()
      const componentSchema = this.loadIndividualSchema(
        'component-schema-v2.json'
      )
      const pageSchema = this.loadIndividualSchema('page-schema-v2.json')
      const listSchema = this.loadIndividualSchema('list-schema-v2.json')

      const userPrompt = this.promptBuilder.buildFormGenerationPrompt(
        description,
        {
          complexity: 'medium',
          maxPages: 10,
          includeConditionals: true
        }
      )

      const systemPrompt = `${this.promptBuilder.buildSystemPrompt()}

## V2 SCHEMA VALIDATION REQUIREMENTS:

You must generate forms that validate against these exact V2 schemas:

**Form Definition Schema:**
${JSON.stringify(formSchema, null, 2)}

**Component Schema:**
${JSON.stringify(componentSchema, null, 2)}

**Page Schema:**
${JSON.stringify(pageSchema, null, 2)}

**List Schema:**
${JSON.stringify(listSchema, null, 2)}

CRITICAL: Follow these schemas exactly. Pay special attention to:
- RelativeDate conditions use "period" (number), "unit", "direction" 
- All "id" fields must be valid UUID v4 format
- Component "name" fields must be valid JavaScript identifiers
- List-based components must reference existing lists
- All cross-references must be valid`

      const messages = [
        {
          role: /** @type {const} */ ('user'),
          content: userPrompt
        }
      ]

      // Count tokens before making the API call
      const estimatedInputTokens = await this.countTokens(
        systemPrompt,
        messages
      )
      logger.info(
        `Estimated input tokens for direct generation: ${estimatedInputTokens.toLocaleString()}`
      )

      let response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages
      })

      await updateProgress('processing', 'Processing and validating form...', {
        step: 2
      })

      let formDefinition = null
      let refinementAttempts = 0
      const maxRefinements = 10

      while (refinementAttempts < maxRefinements && !formDefinition) {
        try {
          const firstContent = response.content[0]
          if (firstContent.type !== 'text') {
            throw new Error('No valid text content found in AI response')
          }

          const jsonString = firstContent.text

          const candidateForm =
            this.responseParser.parseFormDefinition(jsonString)

          const validationResult =
            this.formValidator.validateFormIntegrity(candidateForm)

          if (validationResult.isValid) {
            formDefinition = candidateForm
            logger.info('Direct generation: form validation passed')
            break
          } else {
            logger.warn(
              `Direct generation validation failed with ${validationResult.errors.length} errors, attempting refinement`
            )

            if (refinementAttempts >= maxRefinements - 1) {
              formDefinition = candidateForm
              logger.warn(
                'Direct generation: accepting form with validation warnings after max refinements'
              )
              break
            }

            refinementAttempts++
            logger.info(
              `Direct generation refinement attempt ${refinementAttempts}/${maxRefinements}`
            )

            const errorDetails = this.formatValidationErrors(
              validationResult.errors
            )

            const refinementPrompt = `The generated form has validation errors. Please fix them and generate a corrected FormDefinitionV2.

VALIDATION ERRORS:
${errorDetails}

PROCESSED FORM THAT FAILED VALIDATION:
${JSON.stringify(candidateForm, null, 2)}

IMPORTANT: The above form has already been processed with automatic fixes (UUIDs generated, component titles fixed, etc.). Your task is to fix the remaining validation errors while preserving all existing valid structure.

Generate ONLY the corrected JSON - no explanations.`

            // Get refined version from Claude
            response = await this.client.messages.create({
              model: this.model,
              max_tokens: this.maxTokens,
              temperature: this.temperature,
              system: this.promptBuilder.buildSystemPrompt(),
              messages: [
                {
                  role: 'user',
                  content: refinementPrompt
                }
              ]
            })

            await updateProgress(
              'refinement',
              `Refining form design (attempt ${refinementAttempts})...`,
              { step: 3, refinement: refinementAttempts }
            )
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.name === 'ValidationError' &&
            refinementAttempts < maxRefinements - 1
          ) {
            refinementAttempts++
            logger.warn(
              `Direct generation: schema validation failed, attempting refinement ${refinementAttempts}/${maxRefinements}`
            )

            const refinementPrompt = `The generated form failed schema validation. Please fix the errors and generate a corrected FormDefinitionV2.

ERROR: ${error.message}

REQUIREMENTS:
- Must be valid FormDefinitionV2 JSON
- All UUIDs must be valid v4 format (no invalid characters like 'g', 'h', 'i')
- All required fields must be present
- Component titles cannot be empty
- List references must be valid

Generate ONLY the corrected JSON - no explanations.

Original request: ${description}`

            response = await this.client.messages.create({
              model: this.model,
              max_tokens: this.maxTokens,
              temperature: this.temperature,
              system: this.promptBuilder.buildSystemPrompt(),
              messages: [
                {
                  role: 'user',
                  content: refinementPrompt
                }
              ]
            })

            await updateProgress(
              'refinement',
              `Fixing schema validation errors (attempt ${refinementAttempts})...`,
              { step: 3, refinement: refinementAttempts }
            )
          } else {
            throw error
          }
        }
      }

      if (!formDefinition) {
        throw new Error(
          'Failed to generate valid form after all refinement attempts'
        )
      }

      const actualUsage = {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }

      // Log token usage and cost estimate
      const cost = this.estimateCost(
        actualUsage.inputTokens,
        actualUsage.outputTokens,
        this.model
      )
      logger.info(`=== TOKEN USAGE SUMMARY ===`)
      logger.info(`Model: ${this.model}`)
      logger.info(`Input Tokens: ${actualUsage.inputTokens.toLocaleString()}`)
      logger.info(`Output Tokens: ${actualUsage.outputTokens.toLocaleString()}`)
      logger.info(
        `Total Tokens: ${(actualUsage.inputTokens + actualUsage.outputTokens).toLocaleString()}`
      )
      logger.info(`Cost Estimate: £${cost.toFixed(2)}`)
      logger.info(`=== END TOKEN USAGE ===`)

      return {
        content: JSON.stringify(formDefinition, null, 2),
        formDefinition,
        usage: actualUsage,
        model: this.model,
        directApproach: true,
        conversationTurns: 1,
        refinementAttempts
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error('Direct generation failed:', errorMessage)
      throw error
    }
  }

  /**
   * Generate form using Claude's agentic workflow
   * @param {string} description - The form description
   * @param {string} _title - The form title
   * @param {Function} updateProgress - Progress callback function
   * @returns {Promise<any>} - The generated form definition
   */
  async generateFormAgentic(description, _title, updateProgress) {
    try {
      const systemPrompt = this.promptBuilder.buildSystemPrompt()

      const userMessage = `Create a form based on this description: ${description}

Start by analysing the requirements using the analyse_form_requirements tool.`

      const tools = this.createAgenticTools()

      const messages = /** @type {any[]} */ ([
        {
          role: 'user',
          content: userMessage
        }
      ])

      // Count tokens for initial message to get estimate
      const estimatedInputTokens = await this.countTokens(
        systemPrompt,
        messages,
        tools
      )
      logger.info(
        `Estimated input tokens for agentic generation: ${estimatedInputTokens.toLocaleString()}`
      )

      const workflowSteps = []
      let formDefinition = null
      let totalInputTokens = 0
      let totalOutputTokens = 0
      let conversationTurn = 0
      let refinementAttempts = 0
      const maxTurns = 30
      const maxRefinements = 10

      const completedSteps = new Set()

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (conversationTurn < maxTurns && !formDefinition) {
        conversationTurn++

        try {
          const response = await this.client.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            system: systemPrompt,
            messages,
            tools
          })

          totalInputTokens += response.usage.input_tokens
          totalOutputTokens += response.usage.output_tokens

          messages.push({
            role: 'assistant',
            content: response.content
          })

          const toolUses = response.content.filter(
            /** @param {any} block */ (block) => block.type === 'tool_use'
          )

          if (toolUses.length === 0) {
            messages.push({
              role: 'user',
              content:
                'Please continue with the next step in your workflow. If you have completed the analysis, proceed to generate_form_structure. When you have fully designed the form, call finalise_form_definition.'
            })
            continue
          }

          const toolResults = /** @type {any[]} */ ([])

          for (const toolUse of toolUses) {
            if (toolUse.type === 'tool_use') {
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

              // Update progress based on actual AI workflow steps
              switch (toolUse.name) {
                case 'analyse_form_requirements':
                  if (!completedSteps.has('analysis')) {
                    await updateProgress(
                      'analysis',
                      'Analysing your form requirements...',
                      { step: stepNumber }
                    )
                    completedSteps.add('analysis')
                  }
                  break
                case 'generate_form_structure':
                  if (!completedSteps.has('design')) {
                    await updateProgress(
                      'design',
                      'Designing form structure and pages...',
                      { step: stepNumber }
                    )
                    completedSteps.add('design')
                  }
                  break
                case 'design_form_lists':
                  if (!completedSteps.has('lists')) {
                    await updateProgress(
                      'lists',
                      'Creating dropdown and selection lists...',
                      { step: stepNumber }
                    )
                    completedSteps.add('lists')
                  }
                  break
                case 'design_form_components':
                  if (!completedSteps.has('components')) {
                    await updateProgress(
                      'components',
                      'Adding form fields and components...',
                      { step: stepNumber }
                    )
                    completedSteps.add('components')
                  }
                  break
                case 'validate_form_logic':
                  if (!completedSteps.has('validation')) {
                    await updateProgress(
                      'validation',
                      'Validating form logic and flow...',
                      { step: stepNumber }
                    )
                    completedSteps.add('validation')
                  }
                  break
                case 'refine_form_design':
                  // Don't mark as completed since we might refine multiple times
                  await updateProgress(
                    'refinement',
                    'Refining form design...',
                    { step: stepNumber, refinement: refinementAttempts + 1 }
                  )
                  break
                case 'finalise_form_definition':
                  await updateProgress(
                    'finalising',
                    'Finalising and validating your form...',
                    { step: stepNumber }
                  )
                  break
              }

              if (toolUse.name === 'finalise_form_definition') {
                const rawForm = toolUse.input

                const jsonString = JSON.stringify(rawForm, null, 2)
                const candidateForm =
                  this.responseParser.parseFormDefinition(jsonString)

                const validationResult =
                  this.formValidator.validateFormIntegrity(candidateForm)

                if (validationResult.isValid) {
                  formDefinition = candidateForm

                  logger.info(
                    'AI Workflow Complete - Form definition finalized and validated'
                  )

                  toolResults.push({
                    tool_use_id: toolUse.id,
                    type: 'tool_result',
                    content:
                      'Form definition finalized and validated successfully! The form has been generated.'
                  })

                  break
                } else {
                  logger.warn(
                    `Form validation failed with ${validationResult.errors.length} errors, triggering refinement`
                  )

                  if (refinementAttempts >= maxRefinements) {
                    formDefinition = candidateForm

                    logger.warn(
                      'Maximum refinement attempts reached - accepting form with potential validation warnings'
                    )

                    toolResults.push({
                      tool_use_id: toolUse.id,
                      type: 'tool_result',
                      content:
                        'Form definition finalized (with validation warnings). Maximum refinement attempts reached.'
                    })
                    break
                  }

                  refinementAttempts++

                  logger.info(
                    `Starting refinement attempt ${refinementAttempts}/${maxRefinements}`
                  )

                  const errorDetails = this.formatValidationErrors(
                    validationResult.errors
                  )

                  toolResults.push({
                    tool_use_id: toolUse.id,
                    type: 'tool_result',
                    content: `Form validation failed with the following errors:\n\n${errorDetails}\n\nPROCESSED FORM THAT FAILED VALIDATION:\n${JSON.stringify(candidateForm, null, 2)}\n\nIMPORTANT: The above form has already been processed with automatic fixes (UUIDs generated, component titles fixed, etc.). Please use the refine_form_design tool to fix the remaining validation errors while preserving all existing valid structure. Pay special attention to:\n- Missing or empty component titles\n- Missing list references for SelectField/RadiosField/CheckboxesField/AutocompleteField components\n- Missing or invalid UUIDs (must be proper UUID v4 format)\n- Ensure all lists referenced by components exist in the form's lists array`
                  })
                }
              } else {
                let toolResult = ''

                switch (toolUse.name) {
                  case 'analyse_form_requirements': {
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
                      toolResult = `Validation passed with no issues found. Next step: Call finalise_form_definition to complete the form.`
                    }
                    break
                  }
                  case 'refine_form_design': {
                    toolResult =
                      'Refinements applied successfully. Next step: Call finalise_form_definition to complete and validate the form.'
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

          if (formDefinition) {
            break
          }

          if (toolResults.length > 0) {
            messages.push({
              role: 'user',
              content: /** @type {any} */ (toolResults)
            })
          }
        } catch (error) {
          logger.error(`Error in turn ${conversationTurn}:`, error)
          throw error
        }
      }

      if (!formDefinition) {
        const lastFinalisationStep = workflowSteps
          .slice()
          .reverse()
          .find((step) => step.tool === 'finalise_form_definition')

        if (lastFinalisationStep?.input) {
          formDefinition = lastFinalisationStep.input
          logger.warn(
            `Form generation reached max turns (${conversationTurn}), accepting last candidate form with potential validation errors`
          )
        } else {
          throw new Error(
            `Unable to generate a valid form after ${conversationTurn} attempts. The form requirements may be too complex or contain conflicting constraints.`
          )
        }
      }

      const actualUsage = {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens
      }

      // Log token usage and cost estimate
      const cost = this.estimateCost(
        actualUsage.inputTokens,
        actualUsage.outputTokens,
        this.model
      )
      logger.info(`=== TOKEN USAGE SUMMARY ===`)
      logger.info(`Model: ${this.model}`)
      logger.info(`Input Tokens: ${actualUsage.inputTokens.toLocaleString()}`)
      logger.info(`Output Tokens: ${actualUsage.outputTokens.toLocaleString()}`)
      logger.info(
        `Total Tokens: ${(actualUsage.inputTokens + actualUsage.outputTokens).toLocaleString()}`
      )
      logger.info(`Cost Estimate: £${cost.toFixed(2)}`)
      logger.info(`=== END TOKEN USAGE ===`)

      const result = {
        content: JSON.stringify(formDefinition, null, 2),
        formDefinition,
        usage: actualUsage,
        model: this.model,
        workflowSteps,
        agenticApproach: true,
        conversationTurns: conversationTurn,
        refinementAttempts
      }

      if (typeof formDefinition === 'object') {
        const formDef = /** @type {any} */ (formDefinition)
        logger.info('Form definition pages count:', formDef.pages?.length)
        logger.info('Form definition has name:', 'name' in formDef)
      }

      logger.info('=== AI AGENTIC WORKFLOW COMPLETE ===')
      logger.info(`Total autonomous steps: ${workflowSteps.length}`)
      logger.info(`Conversation turns: ${conversationTurn}`)
      logger.info(`Refinement attempts: ${refinementAttempts}`)
      logger.info(
        `Workflow tools used: ${workflowSteps.map((step) => step.tool).join(' → ')}`
      )

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

      return result
    } catch (error) {
      logger.error('Agentic form generation failed', error)
      throw error
    }
  }

  /**
   * Count tokens for a message to get input token estimate
   * @param {string} systemPrompt - System prompt
   * @param {Array<any>} messages - Messages array
   * @param {Array<any>} [tools] - Optional tools array
   * @returns {Promise<number>} - Estimated input tokens
   */
  async countTokens(systemPrompt, messages, tools = undefined) {
    try {
      const countParams = /** @type {any} */ ({
        model: this.model,
        system: systemPrompt,
        messages
      })

      // Add tools if provided
      if (tools && tools.length > 0) {
        countParams.tools = tools
      }

      const response = await this.client.messages.countTokens(countParams)
      return response.input_tokens
    } catch (error) {
      logger.warn('Token counting failed:', error)
      return 0
    }
  }

  /**
   * Estimate cost based on token usage for different Claude models
   * @param {number} inputTokens - Input tokens
   * @param {number} outputTokens - Output tokens
   * @param {string} model - Model name
   * @returns {number} - Estimated cost in GBP
   */
  estimateCost(inputTokens, outputTokens, model) {
    /** @type {Record<string, {input: number, output: number}>} */
    const pricing = {
      'claude-opus-4-20250514': { input: 12, output: 60 },
      'claude-sonnet-4-20250514': { input: 2.4, output: 12 },
      'claude-3-7-sonnet-20250219': { input: 2.4, output: 12 },
      'claude-3-5-sonnet-20241022': { input: 2.4, output: 12 },
      'claude-3-5-haiku-20241022': { input: 0.64, output: 3.2 },
      'claude-3-opus-20240229': { input: 12, output: 60 },
      'claude-3-haiku-20240307': { input: 0.2, output: 1 }
    }
    const modelPricing = pricing[model] ?? pricing['claude-3-5-sonnet-20241022']
    const inputCost = (inputTokens * modelPricing.input) / 1000000
    const outputCost = (outputTokens * modelPricing.output) / 1000000
    return inputCost + outputCost
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
        case 'analyse_form_requirements':
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
        case 'finalise_form_definition': {
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
   * Formats validation errors for Claude to understand and fix
   * @param {Array<any>} errors
   * @returns {string}
   */
  formatValidationErrors(errors) {
    return errors
      .map((error, index) => {
        let formattedError = `${index + 1}. `

        if (error.path) {
          const pathStr = Array.isArray(error.path)
            ? error.path.join('.')
            : String(error.path)
          formattedError += `Path: ${pathStr} - `
        }

        formattedError += String(error.message ?? 'Unknown validation error')

        if (error.type) {
          switch (error.type) {
            case 'duplicate_id_error':
              formattedError += ` (CRITICAL: DUPLICATE ID WILL BREAK FORM AT RUNTIME)`
              break
            case 'any.required':
              formattedError += ` (REQUIRED FIELD MISSING)`
              break
            case 'string.empty':
              formattedError += ` (FIELD CANNOT BE EMPTY)`
              break
            case 'string.uuid':
              formattedError += ` (MUST BE VALID UUID v4 FORMAT)`
              break
            case 'any.only':
              formattedError += ` (INVALID VALUE - CHECK ALLOWED VALUES)`
              break
            case 'array.unique':
              formattedError += ` (DUPLICATE VALUES NOT ALLOWED)`
              break
          }
        }

        if (error.type === 'duplicate_id_error') {
          formattedError += ` → FIX: Generate completely unique UUIDs for all elements. Change one of the duplicate IDs to a new UUID.`
        } else if (error.path) {
          const pathStr = Array.isArray(error.path)
            ? error.path.join('.')
            : String(error.path)
          if (pathStr.includes('components') && pathStr.includes('title')) {
            formattedError += ` → FIX: Add a meaningful title for this component`
          } else if (
            pathStr.includes('components') &&
            pathStr.includes('list')
          ) {
            formattedError += ` → FIX: Reference an existing list ID from the lists array`
          } else if (pathStr.includes('id')) {
            formattedError += ` → FIX: Generate a valid UUID v4 (e.g., "123e4567-e89b-12d3-a456-426614174000")`
          }
        }

        return formattedError
      })
      .join('\n')
  }
}

/**
 * @import { AIProviderConfig, IRateLimiter, ICache } from '~/src/services/ai/types.js'
 */
