const path = require("path")

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "lib"),
    filename: "bundle.js",
    libraryTarget: "var",
    library: "ProductAuthentication",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
};
