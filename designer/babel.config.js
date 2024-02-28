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
    presets: [
      '@babel/typescript',
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          browserslistEnv,
          bugfixes: true,
          corejs: pkg.dependencies['core-js'],
          modules: browserslistEnv === 'node' ? 'auto' : 'commonjs',
          useBuiltIns: 'usage'
        }
      ]
    ],
    plugins: ['@babel/plugin-transform-runtime']
  }
}
