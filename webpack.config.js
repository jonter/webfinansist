const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    app: './src/javascript/index.js'
  },
  output: {
    filename: '[name].js', 
    path: path.resolve(__dirname, './dist'), 
    publicPath: '/dist' 
  },
  module: {
    rules: [{         
      test: /\.js$/,  
      loader: 'babel-loader',
      exclude: '/node_modules/'
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader', 
          options: {
            sourceMap: true, 
            config: { path: 'src/javascript/configs/postcss.config.js' } 
          }
        }
      ]
    }]
  },
  devServer: {
    overlay: true 
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
}