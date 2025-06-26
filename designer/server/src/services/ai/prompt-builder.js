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

**CRITICAL**: This form MUST follow GDS (Government Digital Service) standards. The #1 rule is ONE QUESTION PER PAGE. Any form with multiple questions per page will be rejected.

**IMMEDIATE REJECTION CRITERIA:**
- Multiple input fields on the same page (except first name + last name)
- Asterisks (*) in component titles
- Html intro components on every page

## CRITICAL GDS (GOVERNMENT DIGITAL SERVICE) STANDARDS - MUST FOLLOW:

**RULE #1 - ONE QUESTION PER PAGE (MANDATORY):**
- NEVER put multiple questions on the same page
- Each page must contain exactly ONE question or ONE piece of information
- The ONLY exception is first name + last name together (and only if truly necessary)
- Examples of VIOLATIONS to avoid:
  * Name + email + phone on same page
  * Address + contact details on same page
  * Multiple personal details on same page

**RULE #2 - CONTACT METHOD RESTRICTION:**
- NEVER ask for multiple contact methods (phone AND email)
- Choose ONE contact method that's most appropriate for the service
- If you need both, justify why and ask on separate pages

**RULE #3 - QUESTION-BASED PAGE TITLES:**
- Page titles MUST be questions: "What is your full name?" not "Personal details"
- Component titles MUST match page titles exactly
- Use direct, specific questions

**RULE #4 - LOGICAL FLOW:**
1. Start with eligibility questions first
2. Progress through related topics logically  
3. End with summary page
4. Use branching sparingly

**RULE #5 - ESSENTIAL QUESTIONS ONLY:**
- Question every question - only ask what you actually need
- Don't replicate paper forms without reviewing necessity

AVAILABLE COMPONENT TYPES: ${componentTypes}
AVAILABLE OPERATORS FOR CONDITIONS: ${operatorNames}
AVAILABLE CONDITION TYPES: ${conditionTypes}

## V2 SCHEMA REQUIREMENTS (CRITICAL - FOLLOW EXACTLY):

**FORM DEFINITION V2 STRUCTURE:**
{
  "engine": "V2",           // ← REQUIRED: Must be "V2"
  "schema": 2,              // ← REQUIRED: Must be number 2
  "pages": [...],           // ← Array of page objects
  "sections": [...],        // ← Array of section objects  
  "lists": [...],           // ← Array of list objects (optional)
  "conditions": [...]       // ← Array of condition objects (optional)
}

**V2 CONDITION STRUCTURE EXAMPLES (CRITICAL - FOLLOW EXACTLY):**

**RelativeDate Condition (for date comparisons):**
{
  "id": "condition-uuid",
  "componentId": "date-component-uuid", 
  "operator": "is before",
  "type": "RelativeDate",
  "value": {
    "period": 16,               // ← NUMBER (not string, not "timeValue")
    "unit": "years",            // ← "days", "weeks", "months", "years"  
    "direction": "in the past"  // ← "in the past" or "in the future" (EXACT enum values)
  }
}

**BooleanValue Condition (for Yes/No fields):**
{
  "id": "condition-uuid",
  "componentId": "yesno-component-uuid",
  "operator": "is", 
  "type": "BooleanValue",
  "value": true            // ← boolean true/false
}

**StringValue Condition (for text fields):**
{
  "id": "condition-uuid", 
  "componentId": "text-component-uuid",
  "operator": "is",
  "type": "StringValue", 
  "value": "some text"     // ← string value
}

**NumberValue Condition (for number fields):**
{
  "id": "condition-uuid",
  "componentId": "number-component-uuid", 
  "operator": "is",
  "type": "NumberValue",
  "value": 42              // ← number value
}

**DateValue Condition (for absolute dates):**
{
  "id": "condition-uuid",
  "componentId": "date-component-uuid",
  "operator": "is",
  "type": "DateValue", 
  "value": "2024-01-15"    // ← ISO date string YYYY-MM-DD
}

**ListItemRef Condition (for list-based components):**
{
  "id": "condition-uuid",
  "componentId": "list-component-uuid",
  "operator": "is",
  "type": "ListItemRef",
  "value": {
    "listId": "list-uuid",     // ← References lists[].id
    "itemId": "item-uuid"      // ← References lists[].items[].id
  }
}

**CONDITION WRAPPER STRUCTURE:**
{
  "id": "condition-wrapper-uuid",
  "displayName": "Readable condition name",
  "coordinator": "and",          // ← REQUIRED if multiple items: "and" or "or"
  "items": [
    // ... condition objects above
  ]
}

**V2 COMPONENT STRUCTURE EXAMPLES:**

**Basic Input Component:**
{
  "id": "component-uuid",
  "type": "TextField",
  "name": "fieldName",         // ← Valid JS identifier (letters only)
  "title": "What is your name?",
  "hint": "Enter your full name",
  "options": { 
    "required": true           // ← Use this instead of asterisks
  },
  "schema": {}                 // ← Always include empty schema object
}

**List-Based Component:**
{
  "id": "component-uuid", 
  "type": "RadiosField",
  "name": "fieldName",
  "title": "What is your choice?",
  "list": "list-uuid",         // ← REQUIRED: References lists[].id
  "options": { "required": true },
  "schema": {}
}

**File Upload Component:**
{
  "id": "component-uuid",
  "type": "FileUploadField", 
  "name": "fieldName",
  "title": "Upload your document",
  "options": {
    "required": true,
    "accept": "application/pdf,image/jpeg,image/png"
  },
  "schema": {}
}

**Content Component (Markdown):**
{
  "id": "component-uuid",
  "type": "Markdown",
  "content": "## Your markdown content here",
  "options": {},
  "schema": {}
  // ← NOTE: Content components don't need "name" or "title"
}

**V2 PAGE STRUCTURE:**
{
  "id": "page-uuid",
  "title": "What is your question?",    // ← Must be a question
  "path": "/page-path",               // ← Unique path starting with /
  "section": "sectionName",           // ← Must reference sections[].name
  "controller": "PageController",     // ← Optional: special controllers
  "condition": "condition-uuid",      // ← Optional: references conditions[].id
  "components": [...],                // ← Array of component objects
  "next": [                          // ← Navigation rules
    {"path": "/next-page"},
    {"path": "/conditional-page", "condition": "condition-uuid"}
  ]
}

**V2 LIST STRUCTURE:**
{
  "id": "list-uuid",
  "name": "listName",                 // ← Unique identifier
  "title": "List display title", 
  "type": "string",                   // ← "string" or "number"
  "items": [
    {
      "id": "item-uuid",
      "text": "Display text",
      "value": "internal-value"
    }
  ]
}

**V2 SECTION STRUCTURE:**
{
  "name": "sectionName",              // ← Referenced by pages[].section
  "title": "Section Display Title"
}

**CRITICAL V2 VALIDATION RULES:**
- RelativeDate conditions use "period" (number), "unit", "direction" - NOT "timePeriod", "timeValue"
- RelativeDate direction must be EXACTLY "in the past" or "in the future" (not "past"/"future")
- All "id" fields must be valid UUID v4 format
- **CRITICAL: ALL IDs MUST BE UNIQUE** - No duplicate IDs across pages, components, conditions, condition items, lists, list items
- Component "name" fields must be valid JavaScript identifiers (letters only, no numbers/symbols)
- List-based components (RadiosField, CheckboxesField, SelectField, AutocompleteField) MUST have "list" property
- FileUploadField components MUST be on pages with "controller": "FileUploadPageController"
- Summary pages MUST use "controller": "SummaryPageController"
- Every page must reference an existing section via "section" field
- Condition wrappers with multiple items MUST have "coordinator" field
- All cross-references must be valid (componentId → components[].id, listId → lists[].id, etc.)
- Component types that support conditions: TextField, EmailAddressField, NumberField, DatePartsField, YesNoField, RadiosField, CheckboxesField, SelectField, AutocompleteField
- **CONDITIONAL PAGE FLOW LOGIC**: When a page asks a question, conditions should be applied to the NEXT pages in navigation, not the current page asking the question

COMPONENT USAGE GUIDELINES:
- **Input Fields**: TextField, EmailAddressField, NumberField, DatePartsField, MonthYearField, MultilineTextField, TelephoneNumberField, UkAddressField
- **Selection Fields**: YesNoField, RadiosField, CheckboxesField, SelectField, AutocompleteField (these require a "list" property)
- **File Upload**: FileUploadField (requires FileUploadPageController and specific page structure)
- **Content/Guidance**: Markdown, Html, Details, InsetText (use SPARINGLY - not on every page)
- **Display Lists**: List component (for showing list data without selection)

**CONTENT COMPONENT USAGE:**
- Html/Markdown components should be used sparingly
- Only add them when essential for user understanding
- NEVER add intro Html components to every page
- Most pages should contain only the main question component

## MANDATORY CONTENT STANDARDS:

**PAGE STRUCTURE REQUIREMENTS:**
- Every page title MUST be a question: "What is your email address?"
- Component title MUST exactly match the page title
- NEVER use statements like "Personal details" or "Contact information"
- One component per page (except first name + last name if essential)
- NEVER add asterisks (*) to titles - GOV.UK shows required fields automatically
- Component titles should be clean: "First name" not "First name *"

**CONTACT INFORMATION RULES:**
- Choose EITHER email OR phone - never both unless absolutely essential
- If both needed, separate pages: "/email-address" and "/phone-number"
- Justify why you need multiple contact methods

**COMMON VIOLATIONS TO AVOID:**
- **NEVER** Multiple questions per page
- **NEVER** Multiple contact methods 
- **NEVER** Statement-based page titles
- **NEVER** Asking for titles unless legally required
- **NEVER** Using "please" in hint text
- **NEVER** Replicating paper forms without review
- **NEVER** Adding asterisks (*) to field titles - use options.required instead
- **NEVER** Adding intro Html components to every page - use sparingly

FORM STRUCTURE - GDS PRINCIPLES:
- **Start with one thing per page**: Each page should contain one piece of information, one decision, or one question
- **Logical flow**: Start with eligibility questions, then progress through related topics
- **Summary page**: Always include a "Check your answers" page using "SummaryPageController"
- **Page paths**: Use descriptive, unique paths starting with "/" (e.g., "/eligibility", "/personal-details")
- **Sections**: Group related pages into logical sections - ALL pages must reference an existing section
- **Avoid unnecessary branching**: Keep the user journey as linear as possible
- **Technical requirements**: Use UUIDs for all id fields (pages, components, lists, conditions)

## SPECIAL PAGE TYPES (MANDATORY CONTROLLERS):

**FILE UPLOAD PAGES - CRITICAL:**
- MUST use "FileUploadPageController" controller for ANY page with FileUploadField
- This is REQUIRED - forms will break without proper controller
- One file upload per page following GDS "one question per page"

**REPEAT PAGES:**
- Use "RepeatPageController" with proper "repeat" object for "add another" functionality

**GUIDANCE PAGES:**
- Use Markdown/Html components for information-only pages

**SUMMARY PAGES:**
- MUST use "SummaryPageController" for check answers page
- Can include Markdown components for additional content

## VALIDATION ENFORCEMENT:
- File upload pages WITHOUT FileUploadPageController = FORM BROKEN
- Multiple questions per page = GDS VIOLATION
- Multiple contact methods = USER EXPERIENCE FAILURE

CRITICAL VALIDATION REQUIREMENTS:
- ALL components MUST have "title" field with meaningful text - NEVER empty or undefined
- Components using lists (SelectField, RadiosField, CheckboxesField, AutocompleteField) MUST have "list" property referencing an existing list ID
- ALL "id" fields must be valid UUIDs: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
- Component names must be valid JavaScript identifiers (letters/numbers only, start with letter)
- Lists MUST have both "id" (UUID) and "name" (string) fields
- Conditions with multiple items MUST have "coordinator" field ("and" or "or")
- All cross-references must be valid (list refs, condition refs)
- Every page must reference an existing section name
- FileUploadField components require FileUploadPageController on their page
- RepeatPageController pages must have "repeat" object with "options" and "schema" properties
- Content components (Markdown, Html) don't require "name" field but need "content" field

## CRITICAL UUID REQUIREMENTS:
- EVERY "id" field MUST be a valid UUID v4 format: 8-4-4-4-12 hex digits
- UUID format example: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
- **CRITICAL**: Only use valid hex characters: 0123456789abcdef (NO g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z)
- Generate completely unique UUIDs for: pages[].id, components[].id, lists[].id, lists[].items[].id, conditions[].id, conditions[].items[].id
- NEVER use undefined, null, empty string, or descriptive names for id fields
- Each UUID must be completely unique across the entire form definition
- UUID examples: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c"

## CRITICAL ID UNIQUENESS REQUIREMENT:
**DUPLICATE IDs WILL BREAK THE FORM AT RUNTIME!**
- Every single ID in the form must be unique across ALL elements
- Check for duplicates between: pages, components, conditions, condition items, lists, list items
- Example of BROKEN form (duplicate ID causes runtime errors)
- Forms engine error: "ConditionField param 'type' must support conditions" often indicates duplicate IDs
- ALWAYS generate completely unique UUIDs for every single ID field

## CONDITIONAL NAVIGATION LOGIC:
**CRITICAL: Apply conditions to the CORRECT pages in the flow**

**CORRECT conditional flow pattern:**
Page A asks "Do you own a dog?" (component: ownsDog)
- Page B shows "You cannot use this service" (condition: ownsDog = false)
- Page C shows "What is your dog's name?" (condition: ownsDog = true)

**WRONG pattern (condition on wrong page):**
Page A asks "Do you own a dog?" but condition is applied incorrectly

**Key rules:**
- Conditions reference components from PREVIOUS pages in the flow
- Apply conditions to DESTINATION pages, not the page with the question
- If Page A asks a question, the condition goes on Pages B/C/D that follow
- Navigation: use "condition" field in next array
- Page condition: use "condition" field on pages that should only show conditionally

## PERFECT GDS COMPLIANCE EXAMPLE - DEMONSTRATES CORRECT "ONE QUESTION PER PAGE":

**WRONG WAY (VIOLATES GDS):**
BAD - Multiple questions on one page:
{
  "title": "Personal Details", // Statement, not question
  "components": [
    {"title": "First name"},     // Multiple questions
    {"title": "Last name"},      // on same page
    {"title": "Email address"},  // VIOLATES GDS
    {"title": "Phone number"}    // VIOLATES GDS
  ]
}

**CORRECT WAY (FOLLOWS GDS):**
GOOD - One question per page:
Page 1: "What is your full name?"
Page 2: "What is your email address?"  
Page 3: "What is your date of birth?"

COMPLETE WORKING EXAMPLE - DOG BREEDING LICENSE FORM (demonstrates perfect GDS compliance):
{
  "engine": "V2",
  "schema": 2,
  "pages": [
    {
      "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "title": "What is your full name?",
      "path": "/full-name",
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
        }
      ],
      "next": [{"path": "/email-address"}]
    },
    {
      "id": "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
      "title": "What is your email address?",
      "path": "/email-address",
      "section": "applicantDetails",
      "components": [
        {
          "id": "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
          "type": "EmailAddressField",
          "name": "emailAddress",
          "title": "What is your email address?",
          "options": { "required": true },
          "schema": {}
        }
      ],
      "next": [{"path": "/breeding-experience"}]
    },
    {
      "id": "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
      "title": "Do you have previous breeding experience?",
      "path": "/breeding-experience",
      "section": "breedingDetails",
      "components": [
        {
          "id": "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
          "type": "YesNoField",
          "name": "hasExperience",
          "title": "Do you have previous breeding experience?",
          "options": { "required": true },
          "schema": {}
        }
      ],
      "next": [{"path": "/breed-type"}]
    },
    {
      "id": "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
      "title": "What type of dog do you breed?",
      "path": "/breed-type",
      "section": "breedingDetails",
      "components": [
        {
          "id": "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
          "type": "RadiosField",
          "name": "breedType",
          "title": "What type of dog do you breed?",
          "hint": "Select the main breed you plan to breed",
          "list": "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f",
          "options": { "required": true },
          "schema": {}
        }
      ],
      "next": [
        {
          "path": "/premises-details",
          "condition": "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a"
        },
        {"path": "/summary"}
      ]
    },
    {
      "id": "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
      "title": "What is the address of your breeding premises?",
      "path": "/premises-details",
      "section": "breedingDetails",
      "condition": "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
      "components": [
        {
          "id": "f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c",
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
      "id": "a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d",
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
      "id": "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f",
      "name": "breedTypes",
      "title": "Dog breed types",
      "type": "string",
      "items": [
        {
          "id": "b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e",
          "text": "Labrador Retriever",
          "value": "labrador-retriever"
        },
        {
          "id": "c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f",
          "text": "German Shepherd",
          "value": "german-shepherd"
        },
        {
          "id": "d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a",
          "text": "Other breed",
          "value": "other"
        }
      ]
    }
  ],
  "conditions": [
    {
      "id": "d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a",
      "displayName": "Has breeding experience",
      "coordinator": "and",
      "items": [
        {
          "id": "e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b",
          "componentId": "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
          "operator": "is",
          "type": "BooleanValue",
          "value": true
        }
      ]
    }
  ]
}

ADDITIONAL EXAMPLES FOR SPECIAL COMPONENTS:

FILE UPLOAD PAGE EXAMPLE:
{
  "id": "f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
  "title": "Upload supporting documents",
  "path": "/upload-documents",
  "section": "documents",
  "controller": "FileUploadPageController",
  "components": [
    {
      "id": "a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d",
      "type": "FileUploadField",
      "name": "supportingDocuments",
      "title": "Upload supporting documents",
      "hint": "Upload files that support your application",
      "options": {
        "required": true,
        "accept": "application/pdf,image/jpeg,image/png,application/msword"
      },
      "schema": {}
    }
  ],
  "next": [{"path": "/summary"}]
}

REPEAT PAGE EXAMPLE (Add Another):
{
  "id": "b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e",
  "title": "Add another vehicle",
  "path": "/add-vehicle",
  "section": "vehicles",
  "controller": "RepeatPageController",
  "repeat": {
    "options": {
      "name": "vehicle",
      "title": "vehicle"
    },
    "schema": {
      "min": 1,
      "max": 10
    }
  },
  "components": [
    {
      "id": "c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f",
      "type": "TextField",
      "name": "vehicleRegistration",
      "title": "What is the vehicle registration number?",
      "options": {"required": true},
      "schema": {}
    }
  ],
  "next": [{"path": "/summary"}]
}

GUIDANCE PAGE EXAMPLE:
{
  "id": "d5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a",
  "title": "Before you start",
  "path": "/guidance",
  "section": "introduction",
  "components": [
    {
      "id": "e6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b",
      "type": "Markdown",
      "content": "## What you'll need\n\nTo complete this application you'll need:\n\n* your National Insurance number\n* bank account details\n* proof of address",
      "options": {},
      "schema": {}
    }
  ],
  "next": [{"path": "/eligibility"}]
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
    const regenerationPrompt = `
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

    return regenerationPrompt
  }

  /**
   * Build GDS analysis prompt for form descriptions
   * @param {string} description - Form description to analyze
   * @returns {string} Analysis prompt
   */
  buildGDSAnalysisPrompt(description) {
    return `Analyze this form description against UK Government Digital Service (GDS) guidelines and best practices. Provide specific, actionable feedback to help the user create better forms.

FORM DESCRIPTION TO ANALYZE:
"${description}"

GDS GUIDELINES TO CHECK AGAINST:

**RULE #1 - ONE QUESTION PER PAGE (MANDATORY):**
- Forms should ask one question per page for better user experience
- The ONLY exception is first name + last name together (and only if truly necessary)
- Check if description suggests multiple questions on same page

**RULE #2 - ESSENTIAL QUESTIONS ONLY:**
- Only ask for information you actually need
- Question every question - is this really necessary?
- Avoid replicating paper forms without review

**RULE #3 - CLEAR PURPOSE & USER-FOCUSED:**
- Description should clearly state what the form is for and who will use it
- Think about the user's journey, not internal processes
- Use plain English, avoid jargon

**RULE #4 - LOGICAL FLOW:**
- Questions should follow a logical order
- Start with eligibility questions first
- Progress through related topics logically
- End with summary page

**RULE #5 - CONTACT METHOD RESTRICTION:**
- Choose ONE contact method that's most appropriate for the service
- NEVER ask for multiple contact methods (phone AND email) unless essential
- If both needed, justify why and ask on separate pages

**RULE #6 - SPECIFIC REQUIREMENTS:**
- Be specific about field types, validation, lists needed
- Mention any conditional logic requirements clearly
- Specify file upload requirements if needed

**RULE #7 - ACCESSIBILITY & STANDARDS:**
- Follow UK government content style guide
- Ensure inclusive design principles
- Consider all users' needs

ANALYSIS REQUIREMENTS:
- Give an overall score from 1-10 (10 = excellent, follows all GDS guidelines)
- Identify specific issues with the description (if any)
- Provide actionable suggestions for improvement
- Focus on helping users create better, more accessible forms
- Be constructive and helpful
- If the description is good, acknowledge it and only suggest minor improvements if any

RESPONSE FORMAT (JSON only):
{
  "isGood": boolean (true if score >= 7),
  "overallScore": number (1-10),
  "feedback": [
    {
      "issue": "Specific problem found in the description",
      "suggestion": "Clear, actionable advice on how to improve this"
    }
  ]
}

Be helpful and constructive. Praise good practices and gently guide users toward GDS compliance.`
  }

  /**
   * Build prompt for refining form descriptions based on GDS feedback
   * @param {string} description - Original form description
   * @param {Array<{issue: string, suggestion: string}>} feedback - GDS feedback items
   * @returns {string} Refinement prompt
   */
  buildDescriptionRefinementPrompt(description, feedback) {
    const feedbackText = feedback
      .map((item) => `Issue: ${item.issue}\nSuggestion: ${item.suggestion}`)
      .join('\n\n')

    return `You are a GDS (Government Digital Service) expert helping to improve form descriptions. 

ORIGINAL DESCRIPTION:
"${description}"

GDS FEEDBACK TO ADDRESS:
${feedbackText}

TASK:
Rewrite the form description to address all the feedback points while:
1. Keeping the core intent and requirements from the original
2. Following GDS best practices
3. Being specific about field types, validation, and structure
4. Mentioning conditional logic clearly
5. Using plain English and avoiding jargon

GUIDELINES:
- Stick as closely as possible to the original description
- Only make changes needed to address the specific feedback
- Keep the same form purpose and key requirements
- Make the description more specific and GDS-compliant
- Don't add unnecessary complexity

Return ONLY the improved description, no other text or explanation.`
  }

  buildSystemPrompt() {
    return `You are an expert UK government digital service form designer. You specialize in creating accessible, user-friendly forms that comply with government design standards and the DEFRA forms v2 schema.

**CRITICAL GDS COMPLIANCE REQUIREMENTS:**
1. ONE QUESTION PER PAGE - This is mandatory and non-negotiable
2. Use question-based page titles: "What is your name?" not "Personal details"
3. Never ask for multiple contact methods unless absolutely essential
4. FileUploadField components MUST have FileUploadPageController
5. NEVER add asterisks (*) to component titles - use options.required instead
6. Use Html/Markdown components sparingly - not on every page

Key principles:
1. Always generate valid, complete FormDefinitionV2 structures using the provided tool
2. Ensure perfect referential integrity between all entities
3. Use semantic, accessible field names and titles
4. Follow UK government content style guide strictly
5. Generate meaningful validation rules
6. Create logical form flows with appropriate conditions
7. Prioritize user experience and accessibility

CRITICAL SCHEMA REQUIREMENTS (enforced by tool schema):
- Lists MUST have both "id" (UUID) and "name" (string) fields
- Conditions with 2+ items MUST have "coordinator" field ("and"/"or")  
- All "id" fields must be valid UUID format
- All cross-references must exist

**FORM VALIDATION CHECKLIST:**
- **REQUIRED:** One component per page (except first name + last name if essential)
- **REQUIRED:** Question-based page titles
- **REQUIRED:** FileUploadPageController for file upload pages
- **REQUIRED:** One contact method only (email OR phone, not both)
- **REQUIRED:** Clean component titles without asterisks (*)
- **REQUIRED:** Minimal use of Html/Markdown components

**FIELD TITLE EXAMPLES:**
- CORRECT: "First name", "Email address", "Date of birth"
- WRONG: "First name *", "Email address *", "Date of birth *"

Use the generate_form_definition tool to create properly structured forms.

**Style Guidelines**: Please do not use emoji or emoticons in any response unless explicitly requested. Keep responses professional and focused on technical accuracy.`
  }
}
