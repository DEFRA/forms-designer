const { existsSync, unlinkSync } = require('node:fs')
const { dirname, join } = require('node:path')

const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { EnvironmentPlugin } = require('webpack')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const { NODE_ENV = 'development', REACT_LOG_LEVEL } = process.env

const govukFrontendPath = dirname(
  require.resolve('govuk-frontend/package.json', {
    paths: [__dirname]
  })
)

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  context: join(__dirname, 'client/src'),
  devtool: NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  entry: {
    application: {
      import: [
        // Nunjucks rendered application
        './javascripts/application.js',
        './stylesheets/application.scss'
      ]
    },
    editor: {
      import: [
        // React rendered form editor
        './index.tsx',
        './stylesheets/editor.scss'
      ]
    }
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'babel-loader',
        exclude: {
          and: [/node_modules/],
          not: [/@xgovformbuilder\/govuk-react-jsx/]
        },
        options: {
          extends: join(__dirname, 'client/babel.config.cjs')
        },

        // Fix missing file extensions in React components
        resolve: { fullySpecified: false }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // Allow sass-loader to process CSS @import first
              // before we use css-loader to extract `url()` etc
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  join(__dirname, 'node_modules'),
                  join(__dirname, '../node_modules')
                ],
                quietDeps: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      }
    ]
  },
  output: {
    path: join(__dirname, 'client/dist'),
    publicPath: '/forms-designer/',

    filename:
      NODE_ENV === 'production'
        ? 'javascripts/[name].[contenthash:7].min.js'
        : 'javascripts/[name].js',

    chunkFilename:
      NODE_ENV === 'production'
        ? 'javascripts/[name].[contenthash:7].min.js'
        : 'javascripts/[name].js'
  },
  plugins: [
    new WebpackAssetsManifest({
      apply() {
        const manifestPath = join(__dirname, 'client/dist/assets/manifest.json')

        // Delete manifest.json before build to delay
        // nodemon startup via `npm run dev` wait-on
        if (existsSync(manifestPath)) {
          unlinkSync(manifestPath)
        }
      },
      output: 'assets/manifest.json'
    }),

    new MiniCssExtractPlugin({
      filename:
        NODE_ENV === 'production'
          ? 'stylesheets/[name].[contenthash:7].min.css'
          : 'stylesheets/[name].css',

      chunkFilename:
        NODE_ENV === 'production'
          ? 'stylesheets/[name].[contenthash:7].min.css'
          : 'stylesheets/[name].css'
    }),

    new EnvironmentPlugin({
      REACT_LOG_LEVEL:
        REACT_LOG_LEVEL || (NODE_ENV === 'production' ? 'warn' : 'debug')
    }),

    new HtmlWebpackPlugin({
      filename: '../../server/dist/common/templates/layouts/legacy-layout.njk',
      template: '../../server/src/common/templates/layouts/legacy-layout.njk',
      hash: false,
      inject: 'body',
      scriptLoading: 'module'
    }),

    new CopyPlugin({
      patterns: [
        {
          from: join(govukFrontendPath, 'govuk/assets'),
          to: 'assets'
        },
        {
          from: 'i18n/translations',
          to: 'assets/translations'
        }
      ]
    }),

    NODE_ENV === 'production' &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'gzip',
        openAnalyzer: false
      })
  ],
  resolve: {
    alias: {
      '~': join(__dirname, 'client'),
      'govuk-frontend': govukFrontendPath,
      '/forms-designer/assets': join(govukFrontendPath, 'govuk/assets/')
    },
    extensionAlias: {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.mjs': ['.mts', '.mjs']
    }
  },
  target: 'browserslist:javascripts'
}
