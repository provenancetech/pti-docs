const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const portfinder = require("portfinder");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = async () => {
  // Load .env files (later ones win). Only REACT_APP_* keys are exposed to the app.
  dotenv.config({ path: path.resolve(__dirname, ".env") });
  dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: true });

  const isProduction = process.env.NODE_ENV === "production";
  const port = await portfinder.getPortPromise({ port: 3000 });

  // Everything the browser bundle and index.html template are allowed to see.
  const clientEnv = Object.fromEntries(
    Object.keys(process.env)
      .filter((key) => key.startsWith("REACT_APP_"))
      .map((key) => [key, process.env[key] || ""])
  );
  clientEnv.NODE_ENV = isProduction ? "production" : "development";
  clientEnv.PUBLIC_URL = "";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build"),
      publicPath: "/",
      filename: "static/js/bundle.js",
      clean: true,
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "eval-source-map",
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          exclude: /node_modules/,
          use: { loader: "babel-loader" },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          type: "asset/resource",
        },
      ],
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      hot: true,
      open: true,
      port,
      proxy: [
        {
          context: ["/generateToken"],
          target: process.env.REACT_APP_PROXY_URL || "http://localhost:5100",
          changeOrigin: true,
        },
      ],
      static: {
        directory: path.join(__dirname, "public"),
      },
      watchFiles: ["src/**/*"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(clientEnv),
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
        inject: "body",
        templateParameters: clientEnv,
        minify: isProduction && {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "build"),
            globOptions: { ignore: ["**/index.html"] },
          },
        ],
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    stats: "minimal",
  };
};
