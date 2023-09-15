const path = require("path");
const { EsbuildPlugin } = require("esbuild-loader");
const SRC_DIR = path.resolve(__dirname, "src");
const OUT_DIR = path.resolve(__dirname, "build");

module.exports = {
  mode: "development",
  entry: {
    'init': path.resolve(SRC_DIR, 'lambdaFunctions/init.js'),
  },
  output: {
    path: `${OUT_DIR}`,
    filename: "[name]/index.js",
    library: "[name]",
    libraryTarget: "umd",
  },
  target: "node",
  module: {
    rules: [
      {
        // Match `.js`, `.jsx`, `.ts` or `.tsx` files
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        options: {
          // JavaScript version to compile to
          target: "es2015",
        },
      },
    ],
  },
  optimization: {
    minimizer: [new EsbuildPlugin()],
  },
};
