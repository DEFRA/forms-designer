/**
 * Prettier config
 * @type {Config}
 */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.md',
      options: {
        embeddedLanguageFormatting: 'off',
        singleQuote: false
      }
    },
    {
      files: '*.scss',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    }
  ]
}

/**
 * @import { Config } from 'prettier'
 */
