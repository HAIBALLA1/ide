const path = require('path');

module.exports = {
  mode: 'production',
  entry: './monaco-lsp-entry.js',
  output: {
    filename: 'monaco-lsp-bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd', 
    
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
         use: {
          loader: 'babel-loader',
           options: { presets: ['@babel/preset-env'] }
         }
      }
    ]
  }
};
