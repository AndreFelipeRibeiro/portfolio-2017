var webpack = require('webpack')

module.exports = {
  entry: {
    "/pages/Home.js": "./scripts/src/pages/Home.js"
  },
  output: {
    publicPath: "./scripts/dist/",
    path: __dirname + "/scripts/dist",
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
