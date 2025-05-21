# Defra forms model

A model and validation library for Defra forms, providing the foundation for form definitions, components, validation, and data handling.

## Features

- **Form Definition** - Core structures for forms, pages, components, and conditions
- **Component Library** - Pre-defined form components with validation
- **JSON Schema** - Ready-to-use JSON schema files for cross-platform validation
- **Conditions Engine** - Logic for determining form flow and visibility
- **Type Definitions** - Complete TypeScript type safety
- **Metadata Handling** - Support for form metadata, versioning, and state management

## Installation

```shell
npm install @defra/forms-model
```

## Usage

### Form Definition

```javascript
import { createForm } from '@defra/forms-model';

const form = createForm({
  name: 'my-form',
  pages: [
    {
      path: '/start',
      title: 'Start page',
      components: [/* components */]
    }
  ],
  sections: [/* sections */]
});
```

### Component Usage

```javascript
import { ComponentType } from '@defra/forms-model';

const textField = {
  type: ComponentType.TextField,
  name: 'fullName',
  title: 'Full name',
  schema: {
    min: 2,
    max: 100
  }
};
```

### Form Validation

#### JSON Schema Files

This package includes pre-generated JSON schema files for use with external JSON Schema validators/ IDEs linting etc:

```javascript
import formSchema from '@defra/forms-model/schemas/form-definition-schema.json';
```

Available schema files include:

##### Form Definition Schemas

- `form-definition-schema.json` - Full form definition validation
- `form-definition-v2-schema.json` - Full form definition V2 validation

##### Component Schemas

- `component-schema.json` - Component validation
- `component-schema-v2.json` - Component validation (v2)

##### Page Schemas

- `page-schema.json` - Page validation
- `page-schema-v2.json` - Page validation (v2)

##### List Schemas

- `list-schema.json` - List validation
- `list-schema-v2.json` - List validation (v2)

##### Form Metadata Schemas

- `form-metadata-schema.json` - Form metadata validation
- `form-metadata-author-schema.json` - Form metadata author validation
- `form-metadata-input-schema.json` - Form metadata input validation
- `form-metadata-state-schema.json` - Form metadata state validation

##### Form Metadata Field Schemas

- `form-metadata-contact-schema.json` - Contact information validation
- `form-metadata-email-schema.json` - Email validation
- `form-metadata-online-schema.json` - Online form metadata validation

##### Form Editor Schemas

- `form-editor-input-page-schema.json` - Form editor input page validation
- `form-editor-input-check-answers-setting-schema.json` - Check answers setting validation
- `form-editor-input-question-schema.json` - Question input validation
- `form-editor-input-page-settings-schema.json` - Page settings validation

##### Form Editor Field Schemas

- `page-type-schema.json` - Page type validation
- `question-type-schema.json` - Question type validation
- `question-type-full-schema.json` - Full question type validation
- `written-answer-sub-schema.json` - Written answer sub-schema validation
- `date-sub-schema.json` - Date sub-schema validation

##### Form Submission Schemas

- `form-submit-payload-schema.json` - Form submission payload validation
- `form-submit-record-schema.json` - Form submission record validation
- `form-submit-recordset-schema.json` - Form submission recordset validation

##### Form Manager Schemas

- `patch-page-schema.json` - Patch page validation

##### Section Schemas

- `question-schema.json` - Question validation

##### Validation Schemas

- `min-schema.json` - Minimum value validation
- `max-schema.json` - Maximum value validation
- `min-length-schema.json` - Minimum length validation
- `max-length-schema.json` - Maximum length validation
- `max-future-schema.json` - Maximum future date validation
- `max-past-schema.json` - Maximum past date validation

##### Common Schemas

- `search-options-schema.json` - Search options validation
- `query-options-schema.json` - Query options validation
- `pagination-options-schema.json` - Pagination options validation
- `sorting-options-schema.json` - Sorting options validation

## Development

### Test Coverage

Unit test coverage threshold, code coverage below which build will fail is set by using jest config, at the moment line coverage threshold is set as 92%, see [jest.config.js](jest.config.js)

### JSON Schema Generation and Publishing

This package generates JSON Schema files from Joi validation schemas during the build process. These schemas are included in the published npm package and are available at runtime.

#### How It Works

When you run `npm run build`, the script `scripts/generate-schemas.js` is executed which:

1. Converts Joi validation schemas to JSON Schema format
2. Enhances schemas with titles and descriptions
3. Writes schema files to the `schemas/` directory

#### Known Quirks

1. **First Build Required**: After a fresh clone, you must run `npm run build` before the schema files will be available locally.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

The following attribution statement MUST be cited in your products and applications when using this information.
`

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
