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

**CRITICAL UUID GENERATION RULES:**
- ONLY use hex characters: 0-9 and a-f (lowercase)
- NEVER use letters g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z
- Generate RANDOM UUIDs, not sequential patterns
- Valid example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
- Invalid examples: "g7h8i9j0-k1l2-3456-ghij-789012345678", "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

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

## REQUIRED FIELDS FOR V2 FORMS:
Every FormDefinitionV2 MUST include:
- "name": "" (leave empty, will be set later)
- "startPage": "/path-to-first-page" (MUST be the path of the first page in the pages array)
- "engine": "V2"
- "schema": 2

Example:
{
  "name": "",
  "startPage": "/what-is-your-name",  // First page path
  "engine": "V2",
  "schema": 2,
  "pages": [
    {
      "id": "...",
      "path": "/what-is-your-name",  // This should be the startPage value
      ...
    }
  ]
}

## KEY EXAMPLES (use these as patterns):

CORRECT V2 CONDITION STRUCTURE (ALWAYS USE THIS FORMAT):
{
  "conditions": [
    {
      "id": "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
      "displayName": "Scotland selected",
      "coordinator": "and",
      "items": [
        {
          "id": "e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b",
          "componentId": "2e7b4f9c-8a1d-4e6b-9f2c-5a8e1b4d7c3f",
          "operator": "is",
          "type": "ListItemRef",
          "value": {
            "listId": "4d8c2f5a-9b1e-4c7d-8f2a-3e6b9c5d1a4f",
            "itemId": "9e2c5f8a-1b4d-4e9c-8f2a-6e1b4c7f9a2d"
          }
        }
      ]
    }
  ]
}

NEVER USE OLD FORMAT WITH 'field' PROPERTY:
{
  "conditions": [
    {
      "id": "...",
      "field": { ... },  // WRONG - DO NOT USE
      "operator": "...",
      "value": { ... }
    }
  ]
}

${JSON.stringify(this.schemaManager.getComponentExamples(), null, 2)}

${JSON.stringify(this.schemaManager.getConditionExamples(), null, 2)}

## COMMON PATTERNS:
1. Radio selection page asking country -> Conditional navigation to terminal page for Scotland
2. Terminal pages use Markdown component with links
3. Always end with SummaryPageController page
4. Use UkAddressField for UK addresses

## SCOTLAND ELIGIBILITY EXAMPLE (USE THIS PATTERN):
When creating forms with Scotland eligibility checks, apply conditions in BOTH places:

1. Country selection page:
{
  "id": "4c8e1f9a-2d6b-4a7c-8f3e-5b9d2c6f1a8e",
  "path": "/what-country-do-you-live-in",
  "components": [
    {
      "id": "7a3f8e2d-9c5b-4e1f-a6d3-8c2f5a9e4b7d",
      "type": "RadiosField",
      "name": "country",
      "list": "country-list-id"
    }
  ],
  "next": [
    {
      "path": "/scotland-not-eligible",
      "condition": "6f2e8a4d-1c9b-4e5f-a3d7-9c4e2f8a6b1d"  // Navigation condition
    },
    {
      "path": "/what-is-your-address"  // Default path
    }
  ]
}

2. Scotland ineligibility page (MUST ALSO have page-level condition):
{
  "id": "9e4c7f2a-8b1d-4f6e-a2c5-7f9e4c2a8b6d",
  "path": "/scotland-not-eligible",
  "condition": "6f2e8a4d-1c9b-4e5f-a3d7-9c4e2f8a6b1d",  // SAME condition ID
  "components": [
    {
      "type": "Markdown",
      "content": "# You cannot use this service\\n\\nOnly residents of England, Wales and Northern Ireland can use this service."
    }
  ]
}

## CRITICAL: HOW TO APPLY CONDITIONS - TWO TYPES

**TYPE 1 - NAVIGATION CONDITIONS (in next array):**
Used to control which page to go to next based on user's answer
- Applied in the "next" array of the page that ASKS the question
- The condition checks the component ON THE CURRENT PAGE

Example: Page asks "What country?" → next array has conditional path to Scotland page

**TYPE 2 - PAGE-LEVEL CONDITIONS (on the page itself):**
Used to control whether a page should be shown at all
- Applied as "condition" property directly on the destination page
- Makes the page only appear when condition is met

**CORRECT PATTERN - USE BOTH TOGETHER:**
1. Page A asks "What country do you live in?" (has RadiosField with country list)
2. Create condition "6f2e8a4d..." that checks if Scotland was selected
3. Apply condition in BOTH places:

   // On Page A (navigation condition):
   "next": [
     {
       "path": "/scotland-not-eligible",
       "condition": "6f2e8a4d..."  // Navigate here if Scotland selected
     },
     {
       "path": "/what-is-your-address"  // Default path
     }
   ]

   // On Scotland page itself (page-level condition):
   {
     "path": "/scotland-not-eligible",
     "condition": "6f2e8a4d...",  // ALSO add here for editor compatibility
     "title": "You cannot use this service",
     ...
   }

**KEY RULES:**
- For conditional pages, use BOTH navigation AND page-level conditions
- Both should reference the SAME condition ID
- This ensures compatibility with the form editor UI
- Order matters in "next" array - conditions evaluated top to bottom

## UUID GENERATION RULES:
- CRITICAL: Generate REAL UUIDs, not sequential patterns like "a1b2c3d4..."
- Use ONLY hex characters: 0-9, a-f (lowercase)
- Format: 8-4-4-4-12 with RANDOM hex values
- NEVER use letters g-z
- NEVER use sequential/pattern IDs like "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
- Every ID must be completely unique and RANDOM
- Good example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
- Bad example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

Generate ONLY the JSON FormDefinitionV2 object - no explanations or markdown.`
  }

  /**
   * Build targeted refinement prompt (minimal tokens)
   * @param {string} originalDescription
   * @param {Array<any>} validationErrors
   * @param {object} currentFormDefinition - The current form definition to fix
   * @returns {string} Refinement prompt
   */
  buildRefinementPrompt(
    originalDescription,
    validationErrors,
    currentFormDefinition
  ) {
    const errorSummary = this.categorizeErrors(validationErrors)

    return `
Fix these specific validation errors in the existing form:

ORIGINAL REQUEST: "${originalDescription}"

CURRENT FORM DEFINITION TO FIX:
${JSON.stringify(currentFormDefinition, null, 2)}

ERRORS TO FIX:
${errorSummary.map((e, i) => `${i + 1}. ${e.category}: ${e.description}`).join('\n')}

CRITICAL FIXES NEEDED:
${this.getTargetedFixes(errorSummary)}

IMPORTANT: 
- Start with the CURRENT FORM DEFINITION above
- Only fix the listed errors
- Do NOT regenerate the entire form
- Keep all existing valid IDs unchanged
- Generate ONLY the corrected JSON`
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
      // eslint-disable-next-line no-console
      console.log('=== ERROR ===')
      // eslint-disable-next-line no-console
      console.log(error)
      // eslint-disable-next-line no-console
      console.log('=== END ERROR ===')

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
      } else if (
        error.type === 'array.unique' ||
        error.message?.includes('duplicate value')
      ) {
        category = 'Duplicate Components'
        description = `Remove duplicate components at: ${error.path}`
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
          fixes.push(
            '- Generate REAL RANDOM UUIDs using ONLY hex characters 0-9,a-f'
          )
          fixes.push('- DO NOT use sequential patterns like a1b2c3d4...')
          fixes.push(
            '- Example of good UUID: f47ac10b-58cc-4372-a567-0e02b2c3d479'
          )
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
        case 'Duplicate Components':
          fixes.push(
            '- Remove duplicate components from the same components array'
          )
          fixes.push('- Keep only ONE instance of each component per page')
          fixes.push('- Ensure each component has unique content and purpose')
          break
        default:
          fixes.push(
            `- Fix ${category.toLowerCase()} errors as described above`
          )
          fixes.push(
            '- Ensure all form elements follow FormDefinitionV2 schema'
          )
          fixes.push(
            '- Validate all required fields are present and correctly formatted'
          )
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
