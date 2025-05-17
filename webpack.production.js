const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  output: {
    publicPath: "/mahjong-practice/",
  },
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
      // MiniCssExtractPluginはCSSを外部ファイル(.css)に出力するものである。
      // 本番環境ではJSからスタイル変更するよりもCSSでスタイルを割り当てた方がパフォーマンスがよいので
      // MiniCssExtractPluginで.cssを出力する。
      // https://chaika.hatenablog.com/entry/2020/10/22/083000
      {
        test: /\.(css|scss)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
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
          filename: "static/images/[name][ext]", // 出力先とファイル名
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
    new MiniCssExtractPlugin({
      filename: "static/css/main.[contenthash].css",
    }),
  ],
});
