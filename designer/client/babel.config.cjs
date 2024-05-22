const pkg = require('../package.json')

const { NODE_ENV } = process.env

/**
 * Babel config
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  plugins: [
    [
      'module-resolver',
      NODE_ENV === 'test'
        ? {
            // Relative to project
            root: ['../../'],
            alias: { '~': './designer/client' }
          }
        : {
            // Relative to workspace
            root: ['./client'],
            alias: { '~': './client' }
          }
    ]
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        development: NODE_ENV === 'development',
        runtime: 'automatic',
        useBuiltIns: true
      }
    ],
    [
      '@babel/preset-env',
      {
        browserslistEnv: 'javascripts',

        // Apply bug fixes to avoid transforms
        bugfixes: true,

        // Apply ES module transforms for Jest
        // https://jestjs.io/docs/ecmascript-modules
        modules: NODE_ENV === 'test' ? 'auto' : false,

        // Add polyfills by Browserslist environment
        corejs: pkg.devDependencies['core-js'],
        useBuiltIns: 'usage'
      }
    ]
  ],
  sourceType: 'unambiguous',
  env: {
    test: {
      plugins: [
        [
          'replace-import-extension',
          {
            extMapping: {
              '.cjs': '',
              '.js': '',
              '.jsx': ''
            }
          }
        ],
        'babel-plugin-transform-import-meta'
      ]
    }
  }
}
