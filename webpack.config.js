const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        app: path.resolve(__dirname, 'demo', 'index.ts'),
        styles: path.resolve(__dirname, 'demo', 'index.scss')
    },
    output: {
        filename: 'demo-[name].js',
        path: path.resolve(__dirname),
        publicPath: 'assets'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, 'demo'),
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },
    watch: true,
    plugins: [
        new ExtractTextPlugin('demo-styles.css'),
        // new WebpackCleanupPlugin(),
    ]
};
