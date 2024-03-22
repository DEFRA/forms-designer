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
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
      ],
      files: ['**/*.{cjs,js,jsx,mjs,ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest'
      },
      plugins: ['@typescript-eslint', 'import', 'promise'],
      rules: {
        'import/namespace': [
          'error',
          {
            allowComputed: true
          }
        ],
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
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
      files: ['**/*.{jsx,tsx}'],
      env: {
        browser: true
      },
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
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
      files: [
        '**/*.test.{cjs,js,mjs,ts,tsx}',
        '**/__mocks__/**',
        'jest.environment.*',
        'jest.setup.*'
      ],
      env: {
        jest: true
      },
      extends: ['plugin:jest/style'],
      plugins: ['jest']
    }
  ],
  parserOptions: {
    allowAutomaticSingleRunInference: true,
    project: ['./tsconfig.json', './tsconfig.dev.json'],
    tsconfigRootDir: __dirname,
    EXPERIMENTAL_useProjectService: true
  },
  root: true
}
