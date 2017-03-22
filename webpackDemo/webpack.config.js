var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {main: './app/scripts/main.js'},
    output: {
        path: './dist',
        filename: 'js/[name]-[chunkhash].js'
        //publicPath: 'http://localhost:8080'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        broswers: ['last 5 versions', '>1%']
                                    })
                                ];
                            }
                        }
                    }
                ]
            },
            {
                "test": "/\\.styl$/",
                "use": [
                    'style-loader',
                    {
                        "loader": "css-loader",
                        "options": {
                            "minimize": true,
                            "sourceMap": true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        broswers: ['last 5 versions', '>1%']
                                    })
                                ];
                            }
                        }
                    },
                    {
                        "loader": "stylus-loader",
                        "options": {
                            "sourceMap": true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {presets: ['latest']}
                }],
                include: [
                    path.resolve(__dirname, 'app/scripts')
                ],
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'dist')
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
                // 必须将htmlWebpackPlugin的文件排除掉
                // 否则会影响他的运行
                exclude: [
                    path.resolve(__dirname, 'app/pages')
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name]-[hash:5].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {}
                    }
                ]
            }/*,
             // 与file-loader类似，多了一个转成base64的功能
             {
             test: /\.(jpg|png|gif|svg)$/,
             use: ['url-loader']
             }*/
        ]
    },
    plugins: [
        new cleanWebpackPlugin(['dist']),
        new htmlWebpackPlugin({
            template: 'app/pages/main.html',
            filename: 'index-[hash].html',
            title: 'webpack demo',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ]
};