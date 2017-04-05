var webpack = require('webpack')

module.exports = {
  entry: {
    "/pages/Home.js": "./scripts/src/pages/Home.js",
    "/pages/About.js": "./scripts/src/pages/About.js",
    "/regions/ProjectDetail.js": "./scripts/src/regions/ProjectDetail.js",
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
