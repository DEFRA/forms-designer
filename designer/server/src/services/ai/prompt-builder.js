import { ComponentType, ConditionType, OperatorName } from '@defra/forms-model'

export class PromptBuilder {
  /**
   * @param {string} description
   * @param {object} preferences
   * @param {string} [preferences.complexity]
   * @param {number} [preferences.maxPages]
   * @param {boolean} [preferences.includeConditionals]
   */
  buildFormGenerationPrompt(description, preferences = {}) {
    const componentTypes = Object.values(ComponentType).join(', ')
    const operatorNames = Object.values(OperatorName).join(', ')
    const conditionTypes = Object.values(ConditionType).join(', ')

    const finalPrompt = `
Create a complete UK government digital service form based on this user description:

USER DESCRIPTION:
"${description}"

PREFERENCES:
- Complexity: ${preferences.complexity ?? 'medium'}
- Max pages: ${preferences.maxPages ?? 10}
- Include conditionals: ${preferences.includeConditionals !== false}

REQUIREMENTS:
1. Create a user-friendly, accessible form following GOV.UK design standards
2. Use clear, plain English throughout
3. Include helpful hints and guidance text
4. Generate proper validation rules where appropriate
5. Create logical page flow with meaningful navigation
6. Use appropriate component types for different data requirements

AVAILABLE COMPONENT TYPES: ${componentTypes}
AVAILABLE OPERATORS FOR CONDITIONS: ${operatorNames}
AVAILABLE CONDITION TYPES: ${conditionTypes}

CONTENT GUIDELINES:
- Page titles should be clear and describe what's being asked
- Question titles should be direct (e.g., "What is your full name?")
- Hints should provide helpful guidance without being verbose
- Use lists for multiple choice options where appropriate
- Include validation messages that help users fix errors
- Field names should be semantic and consistent (e.g., fullName, emailAddress)

FORM STRUCTURE:
- Must include at least one regular page plus a summary page
- Summary page should use "SummaryPageController" controller
- All pages need unique paths starting with "/"
- At least one section is required for grouping
- Use UUIDs for all id fields (pages, components, lists, conditions)

CRITICAL VALIDATION REQUIREMENTS:
- ALL components MUST have "title" field with meaningful text - NEVER empty or undefined
- Components using lists (SelectField, RadiosField, CheckboxesField) MUST have "list" property referencing an existing list ID
- ALL "id" fields must be valid UUIDs: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
- Component names must be valid JavaScript identifiers (letters/numbers only, start with letter)
- Lists MUST have both "id" (UUID) and "name" (string) fields
- Conditions with multiple items MUST have "coordinator" field ("and" or "or")
- All cross-references must be valid (list refs, condition refs)
- Every page must reference an existing section name

🚨 CRITICAL UUID REQUIREMENTS 🚨:
- EVERY "id" field MUST be a valid UUID v4 format: 8-4-4-4-12 hex digits
- UUID format example: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
- ⚠️  CRITICAL: Only use valid hex characters: 0123456789abcdef (NO g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z)
- Generate completely unique UUIDs for: pages[].id, components[].id, lists[].id, lists[].items[].id, conditions[].id, conditions[].items[].id
- NEVER use undefined, null, empty string, or descriptive names for id fields
- Each UUID must be completely unique across the entire form definition
- UUID examples: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c"

COMPLETE WORKING EXAMPLE - DOG BREEDING LICENSE FORM:
{
  "engine": "V2",
  "schema": 2,
  "pages": [
    {
      "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "title": "Your personal details",
      "path": "/personal-details",
      "section": "applicantDetails",
      "components": [
        {
          "id": "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
          "type": "TextField",
          "name": "fullName",
          "title": "What is your full name?",
          "hint": "Enter your first name and surname",
          "options": { "required": true },
          "schema": {}
        },
        {
          "id": "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
          "type": "EmailField",
          "name": "emailAddress",
          "title": "What is your email address?",
          "options": { "required": true },
          "schema": {}
        }
      ],
      "next": [{"path": "/breeding-experience"}]
    },
    {
      "id": "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
      "title": "Your breeding experience",
      "path": "/breeding-experience",
      "section": "breedingDetails",
      "components": [
        {
          "id": "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
          "type": "YesNoField",
          "name": "hasExperience",
          "title": "Do you have previous breeding experience?",
          "options": { "required": true },
          "schema": {}
        },
        {
          "id": "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
          "type": "RadiosField",
          "name": "breedType",
          "title": "What type of dog do you breed?",
          "hint": "Select the main breed you plan to breed",
          "list": "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
          "options": { "required": true },
          "schema": {}
        }
      ],
      "next": [
        {
          "path": "/premises-details",
          "condition": "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e"
        },
        {"path": "/summary"}
      ]
    },
    {
      "id": "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f",
      "title": "Your premises details",
      "path": "/premises-details",
      "section": "breedingDetails",
      "condition": "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
      "components": [
        {
          "id": "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
          "type": "UkAddressField",
          "name": "premisesAddress",
          "title": "What is the address of your breeding premises?",
          "options": { "required": true },
          "schema": {}
        }
      ],
      "next": [{"path": "/summary"}]
    },
    {
      "id": "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
      "title": "Check your answers",
      "path": "/summary",
      "section": "summary",
      "controller": "SummaryPageController",
      "components": [],
      "next": []
    }
  ],
  "sections": [
    {
      "name": "applicantDetails",
      "title": "About you"
    },
    {
      "name": "breedingDetails",
      "title": "Breeding information"
    },
    {
      "name": "summary",
      "title": "Summary"
    }
  ],
  "lists": [
    {
      "id": "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
      "name": "breedTypes",
      "title": "Dog breed types",
      "type": "string",
      "items": [
        {
          "id": "f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c",
          "text": "Labrador Retriever",
          "value": "labrador-retriever"
        },
        {
          "id": "a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d",
          "text": "German Shepherd",
          "value": "german-shepherd"
        },
        {
          "id": "b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e",
          "text": "Other breed",
          "value": "other"
        }
      ]
    }
  ],
  "conditions": [
    {
      "id": "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
      "displayName": "Has breeding experience",
      "coordinator": "and",
      "items": [
        {
          "id": "c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f",
          "componentId": "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
          "operator": "is",
          "type": "BooleanValue",
          "value": true
        }
      ]
    }
  ]
}

Generate a professional, user-friendly form that meets these requirements.`

    return finalPrompt
  }

  /**
   * @param {string} originalDescription
   * @param {string} feedback
   * @param {object} previousDefinition
   */
  buildRegenerationPrompt(originalDescription, feedback, previousDefinition) {
    return `
Modify this existing form based on user feedback:

ORIGINAL DESCRIPTION:
"${originalDescription}"

CURRENT FORM DEFINITION:
${JSON.stringify(previousDefinition, null, 2)}

USER FEEDBACK: 
"${feedback}"

REQUIREMENTS:
1. Apply the user's feedback while maintaining form quality and accessibility
2. Keep existing structure where possible unless feedback requires changes
3. Ensure all validation requirements are still met
4. Maintain GOV.UK design standards and content guidelines
5. Keep all cross-references valid after changes

Generate an improved form that addresses the user's feedback while maintaining professional quality.`
  }

  buildSystemPrompt() {
    return `You are an expert UK government digital service form designer. You specialize in creating accessible, user-friendly forms that comply with government design standards and the DEFRA forms v2 schema.

Key principles:
1. Always generate valid, complete FormDefinitionV2 structures using the provided tool
2. Ensure perfect referential integrity between all entities
3. Use semantic, accessible field names and titles
4. Follow UK government content style guide
5. Generate meaningful validation rules
6. Create logical form flows with appropriate conditions
7. Prioritize user experience and accessibility

CRITICAL SCHEMA REQUIREMENTS (enforced by tool schema):
- Lists MUST have both "id" (UUID) and "name" (string) fields
- Conditions with 2+ items MUST have "coordinator" field ("and"/"or")  
- All "id" fields must be valid UUID format
- All cross-references must exist

Use the generate_form_definition tool to create properly structured forms.`
  }
}
