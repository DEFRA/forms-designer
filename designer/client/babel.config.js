const pkg = require('../package.json')

const { NODE_ENV } = process.env

/**
 * Babel config
 *
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
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        browserslistEnv: 'javascripts',
        bugfixes: true,
        corejs: pkg.devDependencies['core-js'],
        modules: NODE_ENV === 'test' ? 'auto' : 'umd',
        useBuiltIns: 'usage'
      }
    ]
  ],
  sourceType: 'unambiguous'
}
