const pkg = require('./package.json')

module.exports = {
  presets: [
    '@babel/typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        browserslistEnv: 'javascripts',
        corejs: pkg.dependencies['core-js'],
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime']
}
