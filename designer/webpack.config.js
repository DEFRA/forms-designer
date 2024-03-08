const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const autoprefixer = require('autoprefixer')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const devMode = process.env.NODE_ENV !== 'production'
const prodMode = process.env.NODE_ENV === 'production'
const environment = prodMode ? 'production' : 'development'
const logLevel = process.env.REACT_LOG_LEVEL || (prodMode ? 'warn' : 'debug')

const webpackConfig = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  stylesheets: {
    components: path.resolve(__dirname, 'server', 'common', 'components')
  }
}

const clientOutput = path.resolve(__dirname, 'dist', 'client')

const formDesignerClient = {
  target: 'web',
  mode: environment,
  watch: devMode,
  entry: path.resolve(__dirname, 'client', 'index.tsx'),
  output: {
    path: clientOutput,
    filename: 'assets/[name].js',
    publicPath: '/forms-designer/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  node: {
    __dirname: false
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules\/(?!@xgovformbuilder\/)/,
        loader: 'babel-loader',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../',
              esModule: false
            }
          },
          {
            loader: 'css-loader',
            options: {}
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [__dirname, path.resolve(__dirname, '../')],
                outputStyle: 'expanded',
                quietDeps: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/images/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(
        __dirname,
        'server',
        'common',
        'templates',
        'layouts',
        'legacy-layout.njk'
      ),
      filename: 'common/templates/layouts/legacy-layout.njk',
      minify: prodMode,
      scriptLoading: 'defer',
      inject: 'head',
      hash: prodMode
    }),
    new MiniCssExtractPlugin({
      filename: devMode
        ? 'assets/css/[name].css'
        : 'assets/css/[name].[contenthash].css',
      chunkFilename: devMode
        ? 'assets/css/[id].css'
        : 'assets/css/[id].[contenthash].css'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'client/i18n/translations', to: 'assets/translations' },
        { from: 'server/views', to: 'views' }
      ]
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'gzip',
      openAnalyzer: false
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
}

const client = {
  target: 'web',
  entry: {
    application: './client/assets/javascripts/application.js'
  },
  mode: webpackConfig.isDevelopment ? 'development' : 'production',
  ...(webpackConfig.isDevelopment && { devtool: 'source-map' }),
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000
  },
  output: {
    filename: 'js/[name].[fullhash].js',
    path: path.join(clientOutput, 'assets'),
    library: '[name]'
  },
  module: {
    rules: [
      ...(webpackConfig.isDevelopment
        ? [
            {
              test: /\.js$/,
              enforce: 'pre',
              use: ['source-map-loader']
            }
          ]
        : []),
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(?:s[ac]|c)ss$/i,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              esModule: false
            }
          },
          'css-loader',
          ...(webpackConfig.isDevelopment ? ['resolve-url-loader'] : []),
          {
            loader: 'sass-loader',
            options: {
              ...(webpackConfig.isDevelopment && { sourceMap: true }),
              sassOptions: {
                outputStyle: 'compressed',
                quietDeps: true,
                includePaths: [webpackConfig.stylesheets.components]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]'
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new WebpackAssetsManifest({
      output: 'manifest.json'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css'
    })
  ]
}

const server = {
  target: 'node',
  mode: environment,
  watch: devMode,
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'server', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  node: {
    __dirname: false
  },
  watchOptions: {
    poll: 1000 // enable polling since fsevents are not supported in docker
  },
  module: {
    rules: [
      // TODO dev only
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: [
    nodeExternals({
      additionalModuleDirs: [path.resolve(__dirname, '../node_modules')],
      modulesDir: path.resolve(__dirname, 'node_modules'),
      allowlist: [/^@defra\//]
    })
  ],
  externalsPresets: {
    node: true
  }
}

// FIXME migrate old form designer client to the new frontend stack
// we might get collissions between the two otherwise. New client takes precedence.
module.exports = [formDesignerClient, client, server]
