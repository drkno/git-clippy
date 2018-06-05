const { join } = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildDir = join(__dirname, 'build');
const srcDir = join(__dirname, 'src', 'scripts');

module.exports = {
    entry: {
        main: join(srcDir, 'main.js')
    },
    output: {
        path: buildDir,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.png$/,
                loader: 'file-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new CopyWebpackPlugin([{ from: join(__dirname, 'src/raw'),  to: buildDir }], {})
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map',
    target: 'web'
};
