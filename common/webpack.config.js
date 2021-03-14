const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './examples/__build__'),
    publicPath: '/__build__/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
    ],
  },
  resolve: {
    alias: {
      '@coffee-hmm/common': path.resolve(__dirname, './dist'),
    },
  },
  entry: './examples/app.js',
};
