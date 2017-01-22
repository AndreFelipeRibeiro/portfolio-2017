var webpack = require('webpack')

module.exports = {
  entry: "./src/scripts",
  output: {
    publicPath: "/dist/scripts/",
    path: __dirname + "/dist/scripts",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: "/node_modules",
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.less$/,
        loaders: ["style", "css", "less"],
        exclude: "/node_modules"
      }
    ]
  }
}
