const pkg = require('./package.json')

const { BABEL_ENV = 'node' } = process.env

/**
 * Babel config
 *
 * @type {import('@babel/core').ConfigFunction}
 */
module.exports = (api) => {
  const browserslistEnv = api.caller((caller) =>
    caller?.target === 'web' ? 'javascripts' : BABEL_ENV
  )

  return {
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~': '.'
          }
        }
      ]
    ],
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          browserslistEnv,
          bugfixes: true,
          corejs: pkg.devDependencies['core-js'],
          useBuiltIns: 'usage'
        }
      ]
    ],
    sourceType: 'unambiguous'
  }
}
