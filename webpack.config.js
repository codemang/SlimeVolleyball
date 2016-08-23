var webpack         = require('webpack');
var html            = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  devtool: 'source-map',
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
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
  ],
  devServer: {
    contentBase: __dirname + '/build',
    hot: true,
    inline: true,
    colors: true,
    proxy: {
        //Specify any requests on the /socket.io path to be
        //routed to the HTTP server created above
        '/socket.io': `http://localhost:${8080}`
    },
    port: 3000
  }
}