const path = require('path')

module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/main.js']
  },
  output: {
    path: path.resolve(__dirname, 'built'),
    filename: 'bundled-main.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
}
