const path = require('path')
const htmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')


// 设置的变量保存在 process.env 这个对象中
const isDev = process.env.NODE_ENV === 'development'
const cfg = {
    // __dirname表示当前文件所在目录的地址
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },{
                test: /\.css$/,
                use: [
                    // 将css以style的形式插入到html中
                    'style-loader',
                    'css-loader',
                ]
            },{
                test: /\.(img|png|jpg|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 如果图片小于1024,则使用base64转义到html中
                        limit: 20,
                        // 输出文件的名称
                        name: '[name].[ext]',
                        // 图片放在指定路径下
                    }
                }]
            },{
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    // 处理styl文件,处理完成后是css文件,然后丢给css-loader进行处理
                    'stylus-loader',
                ]
            },{
                test: /\.jsx/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev && '"development"' || '"production"'
            }
        }),
        new htmlPlugin({
        }),
    ],
    target: 'web',
}

if(isDev){
    // 帮助调试代码
    cfg.devtool = '#cheap-module-eval-source-map'

    cfg.devServer = {
        port: '8000',
        host: '127.0.0.1',
        overlay: {
            errors: true
        },
        // histroyFallback: {

        // },
        // 只加载页面上某个组件,而不会整个重新加载,需要new plugin
        // hot: true
    };
    // cfg.plugins.push(
    //     new webpack.HotModuleReplacementPlugin()
    // )
}

module.exports = cfg;