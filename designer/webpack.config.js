const { dirname, join, resolve } = require('node:path')

const { EnvironmentPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const { NODE_ENV = 'development', REACT_LOG_LEVEL } = process.env

/**
 * @satisfies {import('webpack').Configuration}
 */
const client = {
  context: join(__dirname, 'client'),
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
                  join(__dirname, '../node_modules'),
                  join(__dirname, 'node_modules')
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
          filename:
            NODE_ENV === 'production'
              ? 'assets/images/[name].[contenthash:7][ext]'
              : 'assets/images/[name][ext]'
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
    path: join(__dirname, 'dist/client'),
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
      filename: '../server/common/templates/layouts/legacy-layout.njk',
      template: '../server/common/templates/layouts/legacy-layout.njk',
      hash: false,
      inject: 'body',
      scriptLoading: 'module'
    }),

    new CopyPlugin({
      patterns: [
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
      '/forms-designer/assets': join(
        dirname(require.resolve('govuk-frontend/package.json')),
        'govuk/assets/'
      )
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  target: 'web'
}

/**
 * @satisfies {import('webpack').Configuration}
 */
const server = {
  context: join(__dirname, 'server'),
  devtool: 'source-map',
  entry: './index.ts',
  externals: [
    nodeExternals({
      additionalModuleDirs: [resolve(__dirname, '../node_modules')],
      modulesDir: join(__dirname, 'node_modules'),
      allowlist: [/^@defra\//]
    })
  ],
  externalsPresets: {
    node: true
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
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false
  },
  output: {
    path: join(__dirname, 'dist/server'),
    filename: 'index.js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'views',
          to: 'views'
        },
        {
          from: 'common/components',
          to: 'common/components'
        },
        {
          from: 'common/templates',
          to: 'common/templates',

          // Skip layout generated by client HtmlWebpackPlugin
          globOptions: { ignore: ['**/layouts/legacy-layout.njk'] }
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  target: 'node'
}

module.exports = [client, server]
