import * as path from 'path';
import * as merge from 'webpack-merge';

import * as baseCfg from './webpack.base.config';

import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import buddha from './buddha';

const AnalyzerPlugin = [];
(process.env.ANALYZE) && AnalyzerPlugin.push(new BundleAnalyzerPlugin())

module.exports = merge(baseCfg, {
    mode: 'production',
    output: {
        publicPath: '/',
        path: path.resolve('dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    externals: {
        vue: 'vue',
        lodash: 'lodash',
        'qys-pdf/webpack': 'qys-pdf/webpack',
        'qys-pdf/web/pdf_viewer': 'qys-pdf/web/pdf_viewer'
    },
    devtool: false,
    stats: false,
    plugins: [
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [
                    ...buddha
                ],
                notes: [
                    'Compile Success!',
                    ' '
                ],
            },
        }),
        ...AnalyzerPlugin
    ],
    optimization: {
        minimizer: [
          
        ]
    }
})
