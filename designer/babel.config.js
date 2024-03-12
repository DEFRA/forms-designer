const pkg = require('./package.json')

const { BABEL_ENV = 'node' } = process.env

/**
 * Babel config
 *
 * @satisfies {import('@babel/core').ConfigFunction}
 */
module.exports = (api) => {
  const browserslistEnv = api.caller((caller) =>
    caller?.target === 'web' ? 'javascripts' : BABEL_ENV
  )

  return {
    sourceType: 'unambiguous',
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
    ]
  }
}
