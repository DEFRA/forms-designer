export default {
  extends: 'stylelint-config-gds/scss',
  ignoreFiles: ['**/dist/**'],
  overrides: [
    {
      customSyntax: 'postcss-scss',
      files: ['**/*.scss']
    },
    {
      files: ['**/*.scss'],
      rules: {
        'function-url-scheme-allowed-list': ['data', '/^https/'],
        'max-nesting-depth': [3, { ignore: ['pseudo-classes'] }]
      }
    }
  ]
}
