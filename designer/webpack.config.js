import { dirname, join, resolve } from 'node:path'

import CopyPlugin from 'copy-webpack-plugin'
import resolvePkg from 'resolve'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import WebpackAssetsManifest from 'webpack-assets-manifest'

const { EnvironmentPlugin } = webpack
const { NODE_ENV = 'development', REACT_LOG_LEVEL } = process.env

const govukFrontendPath = dirname(
  resolvePkg.sync('govuk-frontend/package.json', {
    basedir: import.meta.dirname
  })
)

const govukFrontendLegacyPath = dirname(
  resolvePkg.sync('govuk-frontend/package.json', {
    basedir: resolve(import.meta.dirname, '../')
  })
)

export default /** @type {Configuration} */ ({
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
  experiments: {
    outputModule: true
  },
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(js|mjs|scss)$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.(js|jsx|mjs|tsx|ts)$/,
        loader: 'babel-loader',
        exclude: {
          and: [/node_modules/],
          not: [/@xgovformbuilder\/govuk-react-jsx/]
        },
        options: {
          cacheDirectory: true,
          extends: join(import.meta.dirname, 'client/babel.config.cjs')
        },

        // Fix missing file extensions in React components
        resolve: { fullySpecified: false },

        // Flag loaded modules as side effect free
        sideEffects: false
      },
      {
        test: /\.scss$/,
        type: 'asset/resource',
        generator: {
          binary: false,
          filename:
            NODE_ENV === 'production'
              ? 'stylesheets/[name].[contenthash:7].min.css'
              : 'stylesheets/[name].css'
        },
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                loadPaths: [
                  join(import.meta.dirname, 'node_modules'),
                  join(import.meta.dirname, '../node_modules')
                ],
                quietDeps: true,
                sourceMapIncludeSources: true,
                style: 'expanded'
              },
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
  optimization: {
    minimize: NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // Use webpack default compress options
          // https://webpack.js.org/configuration/optimization/#optimizationminimizer
          compress: { passes: 2 },

          // Allow Terser to remove @preserve comments
          format: { comments: false },

          // Include sources content from dependency source maps
          sourceMap: {
            includeSources: true
          },

          // Compatibility workarounds
          safari10: true
        }
      })
    ],

    // Apply cache groups in production
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          /**
           * Use npm package names
           * @param {NormalModule} module
           */
          name({ userRequest }) {
            const [[modulePath, pkgName]] = userRequest.matchAll(
              /node_modules\/([^\\/]+)/g
            )

            // Move into /javascripts/vendor
            return join('vendor', pkgName || modulePath)
          }
        },
        shared: {
          chunks: 'initial',
          name: 'shared',
          test: /node_modules/,
          usedExports: true
        }
      }
    },

    // Skip bundling unused modules
    providedExports: true,
    sideEffects: true,
    usedExports: true
  },
  output: {
    path: join(import.meta.dirname, 'client/dist'),
    filename:
      NODE_ENV === 'production'
        ? 'javascripts/[name].[contenthash:7].min.js'
        : 'javascripts/[name].js',

    chunkFilename:
      NODE_ENV === 'production'
        ? 'javascripts/[name].[chunkhash:7].min.js'
        : 'javascripts/[name].js',
    libraryTarget: 'module',
    module: true
  },
  plugins: [
    new WebpackAssetsManifest(),

    new EnvironmentPlugin({
      REACT_LOG_LEVEL:
        REACT_LOG_LEVEL ?? (NODE_ENV === 'production' ? 'warn' : 'debug')
    }),

    new CopyPlugin({
      patterns: [
        {
          from: join(govukFrontendPath, 'dist/govuk/assets'),
          to: 'assets',
          priority: 2
        },
        {
          from: join(govukFrontendLegacyPath, 'govuk/assets'),
          to: 'assets',
          priority: 1
        },
        {
          from: join(import.meta.dirname, 'client/src/assets'),
          to: 'assets'
        },
        {
          from: 'i18n/translations',
          to: 'assets/translations'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '~': join(import.meta.dirname, 'client'),
      'govuk-frontend/dist': join(govukFrontendPath, 'dist'),
      'govuk-frontend/govuk': [
        join(govukFrontendPath, 'dist/govuk'),
        join(govukFrontendLegacyPath, 'govuk')
      ],
      '/assets': join(govukFrontendPath, 'dist/govuk/assets')
    },
    extensions: ['.js', '.json', '.mjs'],
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
  target: 'browserslist:javascripts',
  watchOptions: {
    aggregateTimeout: 1000
  }
})

/**
 * @import { Configuration, NormalModule } from 'webpack'
 */
