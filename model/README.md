# Defra forms model

A model and validation library for Defra forms, providing the foundation for form definitions, components, validation, and data handling.

## Features

- **Form Definition** - Core structures for forms, pages, components, and conditions
- **Component Library** - Pre-defined form components with validation
- **Validation** - Comprehensive form validation using Joi schemas
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

#### Programmatic Validation

You can validate form definitions programmatically using the provided utility functions:

```javascript
import { validateFormDefinition } from '@defra/forms-model';

const result = validateFormDefinition(myFormData);
if (result.valid) {
  console.log('Form is valid!');
} else {
  console.error('Validation errors:', result.errors);
}
```

For more specific validation, you can validate against any schema:

```javascript
import { validateWithSchema } from '@defra/forms-model';
import { componentSchema } from '@defra/forms-model';

const result = validateWithSchema(componentSchema, myComponent);
if (result.valid) {
  console.log('Component is valid!');
} else {
  console.error('Validation errors:', result.errors);
}
```

#### JSON Schema Files

This package includes pre-generated JSON schema files for use with external JSON Schema validators:

```javascript
import formSchema from '@defra/forms-model/schemas/form-definition-schema.json';
```

Available schema files include:

- `form-definition-schema.json` - Full form definition validation
- `component-schema.json` - Component validation
- `page-schema.json` - Page validation
- `list-schema.json` - List validation
- `form-metadata-schema.json` - Form metadata validation

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
