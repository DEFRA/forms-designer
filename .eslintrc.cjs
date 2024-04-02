/**
 * ESLint config
 *
 * @type {import('eslint').ESLint.ConfigData}
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
      plugins: ['@typescript-eslint', 'import', 'n', 'prettier', 'promise'],
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
