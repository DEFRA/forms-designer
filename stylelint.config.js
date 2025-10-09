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
        'max-nesting-depth': [
          4,
          {
            ignore: ['pseudo-classes', 'blockless-at-rules'],
            ignoreAtRules: ['include']
          }
        ]
      }
    }
  ]
}
