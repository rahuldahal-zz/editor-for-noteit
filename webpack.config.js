const path = require("path");

let cssConfig = {
  test: /\.(sa|sc|c)ss$/i,
  use: ["style-loader", "css-loader?url=false", "sass-loader"],
};

module.exports = {
  entry: "./src/assets/js/main.js",
  output: {
    filename: "bundled.js",
    path: path.resolve(__dirname, "src"),
  },
  mode: "development",
  watch: true,
  module: {
    rules: [cssConfig],
  },
};
