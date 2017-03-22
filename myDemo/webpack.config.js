var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./src/scripts/index.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    }
}