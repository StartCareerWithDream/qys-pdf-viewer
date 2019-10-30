import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import * as baseConfig from './webpack.base.config';

import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

import * as os from 'os';
const networkInterfaces = os.networkInterfaces();

import buddha from './buddha';

let ip = "";
for (var key in networkInterfaces) {
    networkInterfaces[key].forEach(item => {
        if (!item.internal && item.family === "IPv4") {
            ip = item.address;
        }
    });
}

const port = 8087;

const prepareProxy = require('./proxy.js');

const remain = JSON.parse(process.env.npm_config_argv || '').remain;
const args = remain.length ? remain[0].replace(/^--/, '') : 'me';


let proxyTarget = '';
if (/^http/.test(args)) proxyTarget = args;
else proxyTarget = `http://privapp.qiyuesuo.${args}`;


const contentBase = '/static/'
const proxy = prepareProxy(proxyTarget, contentBase);

module.exports = merge(baseConfig, {
    mode: 'development',
    output: {
        publicPath: "/",
    },
    devServer: {
        clientLogLevel: 'error',
        host: ip,
        port,
        hot: true,
        open: true,
        historyApiFallback: true,
        quiet: true,
        overlay: true,
        contentBase,
        proxy
    },
    devtool: "#cheap-module-source-map",
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [
                    ...buddha
                ],
                notes: [
                    `Welcome Developer!`,
                    ``,
                    `Your app is running at http://${ip}:${port}`,
                    `Add all your xhr will proxy to [${proxyTarget.replace('http://', '')}]`
                ],
            },
            clearConsole: true
        }),
    ]
});
