const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const workspaceRoot = path.resolve(__dirname, '../../');

try { require('dotenv').config({ path: require('path').resolve(__dirname, '.env') }); } catch (e) { }

const envVars = ['COGNITO_', 'API_', 'WS_', 'PRESIGN_'];
const envKeys = {};
for (const key of Object.keys(process.env)) {
  if (envVars.some(p => key.startsWith(p))) {
    envKeys["process.env." + key] = JSON.stringify(process.env[key]);
  }
}

module.exports = {
  mode: 'development',
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist/web'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-reanimated': path.resolve(__dirname, 'mocks/react-native-reanimated'),
      'react-native-gesture-handler': 'react-native-web',
      '@': path.resolve(__dirname, 'src'),
    },
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules\/(?!(react-native-reanimated|react-native-gesture-handler|react-native-svg)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: [['babel-plugin-module-resolver', { root: ['./'], alias: { '@': './src' } }]],
          },
        },
      },
      {
        test: /\.m?js$/i,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader'],
      },
      { test: /\.(png|jpg|gif|svg)$/, type: 'asset/resource' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.DefinePlugin({ __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production') }),
    new HtmlWebpackPlugin({ template: './public/index.html', title: 'Voice Agent' }),
  ],
  devServer: { port: 3000, hot: true, historyApiFallback: true, client: { overlay: false } },
};
