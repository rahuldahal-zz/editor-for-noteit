const path = require("path");
const currentTask = process.env.npm_lifecycle_event;

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
  module: {
    rules: [cssConfig],
  },
};

if (currentTask === "dev") {
  module.exports.watch = true;
  module.exports.mode = "development";
} else {
  module.exports.watch = false;
  module.exports.mode = "production";
}
