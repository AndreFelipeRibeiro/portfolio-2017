var webpack = require('webpack')

module.exports = {
  entry: {
    "/Global.js": "./scripts/src/Global.js"
  },
  output: {
    path: __dirname + "/build/scripts/",
    filename: "[name]"
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
      }
    ]
  }
}
