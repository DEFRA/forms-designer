/**
 * ESLint config
 * @type {ESLint.ConfigData}
 */
module.exports = {
  overrides: [
    {
      env: {
        browser: true
      },
      extends: [
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended'
      ],
      files: ['**/*.{jsx,tsx}'],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      },
      plugins: ['jsx-a11y', 'react', 'react-hooks'],
      rules: {
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'warn'
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    }
  ]
}

/**
 * @import { ESLint } from 'eslint'
 */
