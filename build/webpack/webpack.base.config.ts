/// <reference path="../@types/vue-loader/index.d.ts" />
/// <reference path="../@types/webpack-filter-warnings-plugin/index.d.ts" />

import * as webpack from 'webpack';
import * as path from 'path';
import * as VueLoaderPlugin from 'vue-loader/lib/plugin';

const isProduction = (process.env.ENV === "production");

module.exports = {
    output: {
        globalObject: "this"
    },
    node: {
        fs: "empty"
    },
    entry: {
        'pdf-viewer': path.resolve('src/index.js')
    },
    resolve: {
        extensions: [".js", ".json", ".vue"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": path.resolve("src"),
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: [
                "cache-loader",
                "vue-loader"
            ]
        },
        {
            test: /\.js$/,
            use: [
                "cache-loader",
                "babel-loader"
            ],
            exclude: /node_modules(?![/|\\](qys-pdf))/
        },
        {
            test: /\.less$/,
            use: [
                { loader: "style-loader" },
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: !isProduction
                    }
                },
                {
                    loader: "less-loader",
                    options: {
                        sourceMap: !isProduction,
                    }
                }
            ]
        },
        {
            test: /\.css$/,
            use: [
                { loader: "style-loader" },
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: !isProduction
                    }
                }
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            loader: "url-loader",
            query: {
                limit: 10240,
                name: "img/[name].[hash:16].[ext]"
            }
        },
        {
            test: /\.(ttf|woff2?|eot|otf)$/,
            loader: "url-loader",
            query: {
                limit: 10240,
                name: "fonts/[name].[hash:7].[ext]"
            }
        }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                },
                'vendors': {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
            }
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'env': {
                'NODE_ENV': JSON.stringify(`${isProduction ? 'production' : 'development'}`)
            },
        }),
    ]
};
