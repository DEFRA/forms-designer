import { dirname, join } from 'node:path'

import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import resolvePkg from 'resolve'
import webpack from 'webpack'
import WebpackAssetsManifest from 'webpack-assets-manifest'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const { EnvironmentPlugin } = webpack
const { NODE_ENV = 'development', REACT_LOG_LEVEL } = process.env

const govukFrontendPath = dirname(
  resolvePkg.sync('govuk-frontend/package.json', {
    paths: [import.meta.dirname]
  })
)

export default /** @type {import('webpack').Configuration} */ ({
  context: join(import.meta.dirname, 'client/src'),
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
          extends: join(import.meta.dirname, 'client/babel.config.cjs')
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
                  join(import.meta.dirname, 'node_modules'),
                  join(import.meta.dirname, '../node_modules')
                ],
                quietDeps: true
              },
              api: 'modern-compiler',
              warnRuleAsWarning: true
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
    path: join(import.meta.dirname, 'client/dist'),
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
    new WebpackAssetsManifest(),

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
        REACT_LOG_LEVEL ?? (NODE_ENV === 'production' ? 'warn' : 'debug')
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
      '~': join(import.meta.dirname, 'client'),
      'govuk-frontend': govukFrontendPath,
      '/assets': join(govukFrontendPath, 'govuk/assets/')
    },
    extensionAlias: {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.mjs': ['.mts', '.mjs']
    }
  },
  stats: {
    errorDetails: true,
    loggingDebug: ['sass-loader'],
    preset: 'minimal'
  },
  target: 'browserslist:javascripts'
})
