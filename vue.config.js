
var CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    devServer: {
        port: 8086,
        open: true,
        proxy: 'http://privapp.qiyuesuo.me'
    },
    baseUrl: '/',
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
        ]
    }
};