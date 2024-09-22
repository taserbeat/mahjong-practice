const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      /** TypeScriptのモジュール */
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/react"],
            },
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
      },
      /** CSSのモジュール */
      // style-loaderはCSSをメモリ上でJSに埋め込み、.cssファイルの出力は行わない。
      // 開発環境ではメモリ上で更新が完結するJS埋め込みを行う
      // https://chaika.hatenablog.com/entry/2020/10/22/083000
      {
        test: /\.(css|scss)/,
        use: [
          {
            loader: "style-loader",
          },
          {
            // CSSや画像などをwebpackで扱える形式に変換する
            loader: "css-loader",
          },
          {
            // Sassファイル(.scssまたは.sass)をCSSに変換する
            loader: "sass-loader",
          },
        ],
      },
      /** 画像ファイルに対するルール */
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 画像ファイルに対するルール
        type: "asset/resource", // Asset Modulesのタイプ
        generator: {
          filename: "static/images/[name].[ext]", // 出力先とファイル名
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
});
