var webpack = require('webpack');
var html = require('html-webpack-plugin');

module.exports = {
  entry:  [
    __dirname + '/client/app.js',
  ],
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
        exclude: /node_modules/,
        loaders: ["style", "css", "sass"]
      },
    ]
  },
  plugins: [
    new html({template: __dirname + '/client/index.tmpl.html'}),
  ],
}
