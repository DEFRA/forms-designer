import prettierConfig from 'eslint-config-prettier'
import jestPlugin from 'eslint-plugin-jest'
import jsdocPlugin from 'eslint-plugin-jsdoc'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/public/**',
      'designer/client/src/assets/nunjucks/govuk-components.js',
      'designer/precompile-govuk-components.js',
      'designer/precompile.js',
      'designer/bin/precompile.js',
      'node_modules',
      'node_modules/.*'
    ]
  },

  // Neostandard base (replaces standard + import + n + promise)
  ...neostandard({ ts: true, noStyle: true }),

  // TypeScript strict + stylistic type-checked configs
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // JSDoc recommended
  jsdocPlugin.configs['flat/recommended'],

  // Base config for all linted files
  {
    files: ['**/*.{cjs,js,jsx,mjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      jsdoc: jsdocPlugin
    },
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

      // Don't show eslint warnings for types - let TS handle
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // Check type support for template string implicit `.toString()`
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true
        }
      ],

      // Skip rules handled by TypeScript compiler
      'import-x/default': 'off',
      'import-x/extensions': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-unresolved': 'off',

      // Check type imports are annotated inline
      'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],

      // Check import or require statements are A-Z ordered
      'import-x/order': [
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

      // Require hyphens before param description (TSDoc style)
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
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-use-before-define': ['error', 'nofunc']
    }
  },

  // JavaScript-specific JSDoc rules (require param types)
  {
    files: ['**/*.{cjs,js,mjs}'],
    ...jsdocPlugin.configs['flat/recommended-typescript-flavor'],
    rules: {
      ...jsdocPlugin.configs['flat/recommended-typescript-flavor'].rules,

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

  // CJS-specific overrides
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },

  // ESM source type
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      sourceType: 'module'
    }
  },

  // Jest rules for test files
  {
    files: [
      '**/*.test.{cjs,js,mjs,ts,tsx}',
      '**/__mocks__/**',
      '**/jest.environment.*',
      '**/jest.setup.*'
    ],
    ...jestPlugin.configs['flat/recommended'],
    ...jestPlugin.configs['flat/style'],
    plugins: {
      ...jestPlugin.configs['flat/recommended'].plugins,
      ...jestPlugin.configs['flat/style'].plugins
    },
    languageOptions: {
      globals: globals.jest
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      ...jestPlugin.configs['flat/style'].rules,

      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      // Allow Jest to assert on mocked unbound methods
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error'
    }
  },

  // Designer JSX/React/a11y/hooks
  {
    files: ['designer/**/*.{jsx,tsx}'],
    ...jsxA11yPlugin.flatConfigs.recommended,
    plugins: {
      ...jsxA11yPlugin.flatConfigs.recommended.plugins,
      'react-hooks': reactHooksPlugin
    },
    languageOptions: {
      ...jsxA11yPlugin.flatConfigs.recommended.languageOptions,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    rules: {
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/jsx-handler-names': 'off',
      'react/prop-types': 0,
      'react-hooks/rules-of-hooks': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // Model scripts: not in tsconfig, disable type-checked rules
  {
    files: ['model/scripts/**'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: false
      }
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'import-x/consistent-type-specifier-style': 'off',
      'import-x/order': 'off',
      'jest/no-conditional-expect': 'off',
      'jest/unbound-method': 'off',
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/require-hyphen-before-param-description': 'off',
      'jsdoc/require-jsdoc': 'off',
      'no-console': 'off',
      'no-empty': 'off',
      'no-eval': 'off',
      'no-extend-native': 'off',
      'no-restricted-imports': 'off',
      'symbol-description': 'off'
    }
  },

  // Prettier (disables conflicting style rules)
  prettierConfig
]
