var webpack = require('webpack');
var html    = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry:  __dirname + '/client/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test:  /\.js$/,
        loader: 'babel',
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
    ]
  },
  plugins: [
    new html({template: __dirname + '/client/index.tmpl.html'}),
  ],
  devServer: {
    contentBase: __dirname + '/build',
    port: 12345,
  }
}
