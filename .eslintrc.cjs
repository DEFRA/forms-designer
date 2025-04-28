/**
 * ESLint config
 * @type {ESLint.ConfigData}
 */
module.exports = {
  ignorePatterns: [
    '**/coverage/**',
    '**/dist/**',
    '**/public/**',
    'designer/client/src/assets/nunjucks/govuk-components.js',
    'designer/precompile-govuk-components.js',
    'designer/precompile.js',
    'designer/bin/precompile.js',

    // Enable dotfile linting
    '!.*',
    'node_modules',
    'node_modules/.*'
  ],
  overrides: [
    {
      extends: [
        'standard',
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsdoc/recommended',
        'plugin:n/recommended',
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier'
      ],
      files: ['**/*.{cjs,js,jsx,mjs,ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint', 'import', 'jsdoc', 'n', 'promise'],
      rules: {
        'no-console': 'error',

        // Check type imports are identified
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            fixStyle: 'inline-type-imports'
          }
        ],

        // Allow void return shorthand in arrow functions
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          {
            ignoreArrowShorthand: true
          }
        ],

        // Allow void return in async JSX attributes
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: {
              attributes: false
            }
          }
        ],

        // Only show warnings for missing types
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',

        // Check type support for template string implicit `.toString()`
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowBoolean: true,
            allowNumber: true
          }
        ],

        // Skip rules handled by TypeScript compiler
        'import/default': 'off',
        'import/extensions': 'off',
        'import/named': 'off',
        'import/namespace': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'off',

        // Check type imports are annotated inline
        'import/consistent-type-specifier-style': ['error', 'prefer-inline'],

        // Check import or require statements are A-Z ordered
        'import/order': [
          'error',
          {
            alphabetize: { order: 'asc' },
            named: {
              enabled: true,
              types: 'types-last'
            },
            'newlines-between': 'always'
          }
        ],

        // Check relative import paths use aliases
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['./', '../'],
                message: "Please use '~/*' import alias instead."
              }
            ]
          }
        ],

        // Check for valid formatting
        'jsdoc/check-line-alignment': [
          'warn',
          'never',
          {
            tags: ['param', 'property', 'typedef', 'returns']
          }
        ],

        // Require hyphens before param description
        // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
        'jsdoc/require-hyphen-before-param-description': [
          'warn',
          'always',
          {
            tags: {
              param: 'always',
              property: 'always',
              returns: 'never'
            }
          }
        ],

        // JSDoc blocks are optional but must be valid
        'jsdoc/require-jsdoc': [
          'error',
          {
            enableFixer: false,
            require: {
              FunctionDeclaration: false
            }
          }
        ],

        // JSDoc @param is optional
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-param': 'off',

        // JSDoc @returns is optional
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-returns': 'off',

        // Skip rules handled by TypeScript compiler
        'n/no-extraneous-require': 'off',
        'n/no-extraneous-import': 'off',
        'n/no-missing-require': 'off',
        'n/no-missing-import': 'off',

        // Prefer rules that are type aware
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { ignoreRestSiblings: true }
        ],
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc']
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': [
            '.cjs',
            '.js',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx'
          ]
        },
        'import/resolver': {
          node: true,
          typescript: true
        }
      }
    },
    {
      extends: ['plugin:jsdoc/recommended-typescript-flavor'],
      files: ['**/*.{cjs,js,mjs}'],
      plugins: ['jsdoc'],
      rules: {
        // Promise.prototype.catch() errors cannot be typed in JavaScript
        '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',

        // JSDoc blocks are optional but must be valid
        'jsdoc/require-jsdoc': [
          'error',
          {
            enableFixer: false,
            require: {
              FunctionDeclaration: false
            }
          }
        ],

        // JSDoc @param types are mandatory for JavaScript
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'error',
        'jsdoc/require-param': 'off',

        // JSDoc @returns is optional
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-returns': 'off'
      }
    },
    {
      files: ['**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['**/*.{js,mjs}'],
      parserOptions: {
        sourceType: 'module'
      }
    },
    {
      env: {
        'jest/globals': true
      },
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      files: [
        '**/*.test.{cjs,js,mjs,ts,tsx}',
        '**/__mocks__/**',
        'jest.environment.*',
        'jest.setup.*'
      ],
      plugins: ['jest'],
      rules: {
        // Turn off warnings for jest.Expect 'any' types
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',

        // Allow Jest to assert on mocked unbound methods
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error'
      }
    }
  ],
  root: true
}

/**
 * @import { ESLint } from 'eslint'
 */
