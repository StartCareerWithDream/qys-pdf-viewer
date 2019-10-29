
var CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")

module.exports = {
    // devServer: {
    //     port: 8086,
    //     open: true,
    //     proxy: 'http://privapp.qiyuesuo.cn'
    // },
    publicPath: '/',
    runtimeCompiler: true,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'node_modules/qys-pdf/cmaps',
                    to: 'cmaps'
                }
            ])
        ],
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js',
            libraryTarget: 'umd'
        },
        entry: {
            'pdf-viewer': path.resolve('./src/index.js')
        },
        externals:{
            vue: 'vue',
            'qys-pdf':'qys-pdf'
        }
    }
};