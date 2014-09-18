var path = require('path')
var webpack = require('webpack')

module.exports = {
    debug: true,
    watch: true,
    devtool: 'eval',

    entry: './src/index.js',

    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'build/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx' },
            { test: /\.styl$/, loader: 'style!css!stylus' }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    plugins: [
        new webpack.IgnorePlugin(/vertx/)
    ]
};