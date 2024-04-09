/**
 * ESLint config
 */
module.exports = {
  ignorePatterns: [
    '**/coverage/**',
    '**/dist/**',
    '**/public/**',

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
        'plugin:jsdoc/recommended',
        'plugin:n/recommended',
        'plugin:prettier/recommended',
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier'
      ],
      files: ['**/*.{cjs,js,jsx,mjs,ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        project: ['./tsconfig.json', './tsconfig.dev.json'],
        tsconfigRootDir: __dirname,
        EXPERIMENTAL_useProjectService: true
      },
      plugins: [
        '@typescript-eslint',
        'import',
        'jsdoc',
        'n',
        'prettier',
        'promise'
      ],
      rules: {
        'prettier/prettier': 'error',
        'no-console': 'error',

        // Check import or require statements are A-Z ordered
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

        // Check namespace import members
        'import/namespace': [
          'error',
          {
            allowComputed: true
          }
        ],

        // Check import or require statements are A-Z ordered
        'import/order': [
          'error',
          {
            alphabetize: { order: 'asc' },
            'newlines-between': 'always'
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
              returns: 'always'
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

        // JSDoc @param description is optional
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param': 'off',

        // JSDoc @returns description is optional
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-returns': 'off',

        // Skip rules handled by import plugin
        'n/no-extraneous-require': 'off',
        'n/no-extraneous-import': 'off',
        'n/no-missing-require': 'off',
        'n/no-missing-import': 'off',

        // Prefer rules that are type aware
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
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
          typescript: {
            alwaysTryTypes: true,
            project: [
              './tsconfig.dev.json',
              './designer/client/tsconfig.json',
              './designer/server/tsconfig.json',
              './model/tsconfig.json',
              './queue-model/tsconfig.json'
            ]
          }
        }
      }
    },
    {
      extends: ['plugin:jsdoc/recommended-typescript-flavor'],
      files: ['**/*.{cjs,js,mjs}'],
      plugins: ['jsdoc'],
      rules: {
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

        // JSDoc @param is mandatory for JavaScript
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param': 'off',

        // JSDoc @returns description is optional
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-returns': 'off'
      }
    },
    {
      files: ['**/*.cjs'],
      rules: {
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
        browser: true
      },
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      files: ['**/*.{jsx,tsx}'],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      },
      plugins: ['react', 'react-hooks'],
      rules: {
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'warn'
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    },
    {
      env: {
        jest: true
      },
      extends: ['plugin:jest/style'],
      files: [
        '**/*.test.{cjs,js,mjs,ts,tsx}',
        '**/__mocks__/**',
        'jest.environment.*',
        'jest.setup.*'
      ],
      plugins: ['jest']
    }
  ],
  parserOptions: {
    allowAutomaticSingleRunInference: true
  },
  root: true
}
