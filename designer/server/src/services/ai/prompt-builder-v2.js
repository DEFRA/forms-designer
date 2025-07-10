import { ComponentType, ConditionType, OperatorName } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { SchemaManager } from '~/src/services/ai/schema-manager.js'

const logger = createLogger()

/**
 * Optimized Prompt Builder - Reduces token usage and enables prompt caching
 */
export class PromptBuilderV2 {
  constructor() {
    this.schemaManager = new SchemaManager()
    this.systemPromptCache = null
    logger.info('PromptBuilderV2 initialised')
  }

  /**
   * Build system prompt with caching support
   * @returns {string} System prompt
   */
  buildSystemPrompt() {
    if (this.systemPromptCache) {
      return this.systemPromptCache
    }

    this.systemPromptCache = `You are an expert UK government digital service form designer. You specialize in creating accessible, user-friendly forms that comply with government design standards and the DEFRA forms v2 schema.

**CRITICAL GDS COMPLIANCE REQUIREMENTS:**
1. ONE QUESTION PER PAGE - This is mandatory and non-negotiable
2. Use question-based page titles: "What is your name?" not "Personal details"
3. Never ask for multiple contact methods unless absolutely essential
4. FileUploadField components MUST have FileUploadPageController
5. NEVER add asterisks (*) to component titles - use options.required instead
6. Use Html/Markdown components sparingly - not on every page

Key principles:
1. Always generate valid, complete FormDefinitionV2 structures
2. Ensure perfect referential integrity between all entities
3. Use semantic, accessible field names and titles
4. Follow UK government content style guide strictly
5. Generate meaningful validation rules
6. Create logical form flows with appropriate conditions
7. Prioritize user experience and accessibility

${this.schemaManager.getPromptSchemaInfo()}

**Style Guidelines**: Please do not use emoji or emoticons in any response unless explicitly requested. Keep responses professional and focused on technical accuracy.`

    return this.systemPromptCache
  }

  /**
   * Build optimized form generation prompt
   * @param {string} description
   * @param {any} preferences
   * @returns {string} Optimized prompt
   */
  buildFormGenerationPrompt(description, preferences = {}) {
    const componentTypes = Object.values(ComponentType).join(', ')
    const operatorNames = Object.values(OperatorName).join(', ')
    const conditionTypes = Object.values(ConditionType).join(', ')

    return `
Create a complete UK government digital service form based on this user description:

USER DESCRIPTION:
"${description}"

PREFERENCES:
- Complexity: ${preferences.complexity ?? 'medium'}
- Max pages: ${preferences.maxPages ?? 10}
- Include conditionals: ${preferences.includeConditionals !== false}

**CRITICAL**: This form MUST follow GDS (Government Digital Service) standards. The #1 rule is ONE QUESTION PER PAGE.

AVAILABLE COMPONENT TYPES: ${componentTypes}
AVAILABLE OPERATORS FOR CONDITIONS: ${operatorNames}
AVAILABLE CONDITION TYPES: ${conditionTypes}

## KEY EXAMPLES (use these as patterns):

${JSON.stringify(this.schemaManager.getComponentExamples(), null, 2)}

${JSON.stringify(this.schemaManager.getConditionExamples(), null, 2)}

## COMMON PATTERNS:
1. Radio selection page asking country -> Conditional navigation to terminal page for Scotland
2. Terminal pages use Markdown component with links
3. Always end with SummaryPageController page
4. Use UkAddressField for UK addresses

## UUID GENERATION RULES:
- Use ONLY hex characters: 0-9, a-f (lowercase)
- Format: 8-4-4-4-12 (e.g., "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
- NEVER use letters g-z
- Every ID must be completely unique

Generate ONLY the JSON FormDefinitionV2 object - no explanations or markdown.`
  }

  /**
   * Build targeted refinement prompt (minimal tokens)
   * @param {string} originalDescription
   * @param {Array<any>} validationErrors
   * @returns {string} Refinement prompt
   */
  buildRefinementPrompt(originalDescription, validationErrors) {
    const errorSummary = this.categorizeErrors(validationErrors)

    return `
Fix these specific validation errors in the form:

ORIGINAL REQUEST: "${originalDescription}"

ERRORS TO FIX:
${errorSummary.map((e, i) => `${i + 1}. ${e.category}: ${e.description}`).join('\n')}

CRITICAL FIXES NEEDED:
${this.getTargetedFixes(errorSummary)}

Generate ONLY the corrected JSON - focus on fixing the listed errors.`
  }

  /**
   * Build regeneration prompt with feedback
   * @param {string} originalDescription
   * @param {string} feedback
   * @param {object} currentForm
   * @returns {string} Regeneration prompt
   */
  buildRegenerationPrompt(originalDescription, feedback, currentForm) {
    // Extract only the essential structure to reduce tokens
    const formSummary = /** @type {any} */ (
      this.extractFormSummary(currentForm)
    )

    return `
Modify this existing form based on user feedback:

ORIGINAL DESCRIPTION: "${originalDescription}"

CURRENT FORM STRUCTURE:
- Pages: ${formSummary.pageCount}
- Components: ${formSummary.componentCount}
- Has conditions: ${formSummary.hasConditions}

Page flow:
${formSummary.pageFlow.map((/** @type {{ path: any; title: any; }} */ p) => `- ${p.path}: ${p.title}`).join('\n')}

USER FEEDBACK: "${feedback}"

REQUIREMENTS:
1. Apply the user's feedback while maintaining form quality
2. Keep existing structure where possible unless feedback requires changes
3. Maintain all GDS standards and validation requirements
4. Preserve referential integrity

Generate the complete improved FormDefinitionV2 JSON.`
  }

  /**
   * Categorize validation errors for targeted fixes
   * @param {Array<any>} errors
   * @returns {Array<{category: string, description: string, count: number}>}
   */
  categorizeErrors(errors) {
    const categories = new Map()

    errors.forEach((error) => {
      let category = 'General'
      let description = error.message

      if (error.type === 'duplicate_id_error') {
        category = 'Duplicate IDs'
        description = 'Fix duplicate IDs - all must be unique'
      } else if (error.type === 'string.uuid') {
        category = 'Invalid UUIDs'
        description = 'Fix invalid UUID format (use only 0-9,a-f)'
      } else if (error.type === 'any.required') {
        category = 'Missing Required Fields'
        description = `Add missing field: ${error.path}`
      } else if (error.type === 'string.empty') {
        category = 'Empty Fields'
        description = `Provide value for: ${error.path}`
      }

      const key = `${category}:${description}`
      if (!categories.has(key)) {
        categories.set(key, { category, description, count: 0 })
      }
      categories.get(key).count++
    })

    return Array.from(categories.values())
  }

  /**
   * Get targeted fixes for error categories
   * @param {Array<{category: string, description: string, count: number}>} errorSummary
   * @returns {string}
   */
  getTargetedFixes(errorSummary) {
    /**
     * @type {string[]}
     */
    const fixes = []

    errorSummary.forEach(({ category }) => {
      switch (category) {
        case 'Invalid UUIDs':
          fixes.push('- Generate new UUIDs using ONLY hex characters 0-9,a-f')
          break
        case 'Duplicate IDs':
          fixes.push(
            '- Ensure every ID is completely unique across all elements'
          )
          break
        case 'Empty Fields':
          fixes.push(
            '- Fill in all empty component titles with meaningful questions'
          )
          break
        case 'Missing Required Fields':
          fixes.push('- Add all required fields according to schema')
          break
      }
    })

    return fixes.join('\n')
  }

  /**
   * Extract minimal form summary to reduce tokens
   * @param {any} form
   * @returns {object}
   */
  extractFormSummary(form) {
    const pages = form.pages ?? []
    const componentCount = pages.reduce(
      (/** @type {number} */ sum, /** @type {{ components: any[]; }} */ page) =>
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        sum + (page.components.length ?? 0),
      0
    )

    return {
      pageCount: pages.length,
      componentCount,
      hasConditions: (form.conditions?.length ?? 0) > 0,
      pageFlow: pages.map(
        (
          /** @type {{ path: string; title: string; condition: string | undefined; }} */ page
        ) => ({
          path: page.path,
          title: page.title,
          hasCondition: !!page.condition
        })
      )
    }
  }

  /**
   * Build GDS analysis prompt
   * @param {string} description
   * @returns {string}
   */
  buildGDSAnalysisPrompt(description) {
    return `Analyze this form description against UK Government Digital Service (GDS) guidelines.

FORM DESCRIPTION: "${description}"

Check against these key rules:
1. One question per page
2. Essential questions only
3. Clear purpose and user focus
4. Logical flow
5. Single contact method
6. Specific requirements
7. Accessibility standards

Return JSON only:
{
  "isGood": boolean,
  "overallScore": number (1-10),
  "feedback": [
    {
      "issue": "specific problem",
      "suggestion": "how to improve"
    }
  ]
}`
  }

  /**
   * Build description refinement prompt
   * @param {string} description
   * @param {Array<{issue: string, suggestion: string}>} feedback
   * @returns {string}
   */
  buildDescriptionRefinementPrompt(description, feedback) {
    const feedbackText = feedback
      .map((item) => `- ${item.issue}: ${item.suggestion}`)
      .join('\n')

    return `Improve this form description based on GDS feedback:

ORIGINAL: "${description}"

FEEDBACK:
${feedbackText}

Return ONLY the improved description that addresses all feedback while keeping the original intent.`
  }
}
