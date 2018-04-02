const path = require('path'); // We are using node's native package 'path'  https://nodejs.org/api/path.html
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const ExtractTextPlugin = require('extract-text-webpack-plugin'); 
const ParaViewWebLoaders = require('./loaders.paraviewweb.webpack-2.js'); // paraviewweb loader

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'), //// Now it uses our "src" folder as a starting point
  JS: path.resolve(__dirname, 'src/js'),
};

//plugings defined
var plugins = [
  new HtmlWebpackPlugin({
    template: path.join(paths.SRC, 'index.html'), // index.html is used as a template in which it'll inject bundled app.
  }),
  new ExtractTextPlugin('style.bundle.css') // CSS will be extracted to this bundle file 
];

// paraviewweb pluging added in production enviroment
if(process.env.NODE_ENV === 'production') {
  console.log('==> Production build');
  plugins.push(new webpack.DefinePlugin({
      "process.env": {
          NODE_ENV: JSON.stringify("production"),
      },
  }));
}

// Webpack configuration
module.exports = {
  entry: path.join(paths.JS, 'index.js'),
  output: {
    path: paths.DIST,
    filename: 'index.bundle.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: plugins,
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: require.resolve(path.join(paths.JS, 'index.js')),
        use : [{
          loader: "expose-loader",
          options : 'MyWebApp'
        }]
      },
    ].concat(ParaViewWebLoaders),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias : {
      PVWStyle : path.resolve('./node_modules/paraviewweb/style'),
    },
  },
};