// const path = require("path");
// const currentTask = process.env.npm_lifecycle_event;

// let cssConfig = {
//   test: /\.(sa|sc|c)ss$/i,
//   use: ["style-loader", "css-loader?url=false", "sass-loader"],
// };

// module.exports = {
//   entry: "./src/assets/js/main.js",
//   output: {
//     filename: "bundled.js",
//     path: path.resolve(__dirname, "src"),
//   },
//   module: {
//     rules: [cssConfig],
//   },
// };

// if (currentTask === "dev") {
//   module.exports.watch = true;
//   module.exports.mode = "development";
// } else {
//   module.exports.watch = false;
//   module.exports.mode = "production";
// }

//check if current task is "dev" or "build"
const currentTask = process.env.npm_lifecycle_event;

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

let pages = fse
  .readdirSync("./src")
  .filter((file) => {
    return file.endsWith(".html");
  })
  .map((page) => {
    return new HtmlWebPackPlugin({
      filename: page,
      template: `./src/${page}`,
    });
  });

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("./src/assets/images", "./build/assets/images");
    });
  }
}

// pages.push(new RunAfterCompile());

//cssLoaders

let cssConfig = {
  test: /\.(sa|sc|c)ss$/i,
  use: ["css-loader?url=false", "sass-loader"],
};

//common settings
let config = {
  entry: "./src/assets/js/main.js",
  module: {
    rules: [cssConfig],
  },
};

//separate for "development"
if (currentTask === "dev") {
  cssConfig.use.unshift("style-loader");
  config.watch = true;
  config.mode = "development";
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "src"),
  };
}

//separate for "production"
if (currentTask === "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.mode = "production";
  config.output = {
    filename: "[name]-[chunkhash].js",
    chunkFilename: "[name]-[chunkhash].js",
    path: path.resolve(__dirname, "build"),
  };
  config.optimization = {
    splitChunks: { chunks: "all" },
  }; //separates vendors and custom scripts (vendor = editor.js)
  config.plugins = [
    // new HtmlWebPackPlugin({
    //   filename: "index.html",
    //   template: `./src/index.html`,
    // }),
    ...pages,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles-[chunkhash].css",
    }),
    new RunAfterCompile(),
  ];
}

module.exports = config;
