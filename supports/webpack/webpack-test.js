const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = require('./webpack-base')({
  env: 'test',
  devtool: 'cheap-source-map',
  entry: {
    app: path.join(process.cwd(), 'src/app'),
    vendor: ['react', 'react-dom']
  },
  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: 'assets/[name].js',
    chunkFilename: 'assets/[name].chunk.js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    new CopyWebpackPlugin([
      {
        from: path.join(process.cwd(), 'src', 'icon.png'),
        to: 'assets'
      },
      {
        from: path.join(process.cwd(), 'src', 'assets'),
        to: 'assets'
      }
    ]),
    new UglifyJSPlugin()
  ],
  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },
});
