const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: 'main.js',
        filename: "[name].[contenthash].js",
        assetModuleFilename: 'asset/images/[hash][ext][query]',
    },
    resolve: {
        extensions: ['.js'],
        alias: {  //manejar rutas de los imports con alias
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: { //babel --> Traspilar Javascript
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            { //CSS --> loader css
                test: /\.css|.styl$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader'
                ],
            },
            { //Loader de imagenes de webpack
                test: /\.png/,
                type: 'asset/resource'
            },
            {   //loader de fonts
                test: /\.woff|woff2$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[contenthash].[ext]",
                        outputPath: "./assets/fonts/",
                        publicPath: "../assets/fonts/",
                        esModule: false,
                    }
                }
            }
        ]
    },
    plugins: [ //HTML webpack
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }), //Plugin css
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css',
        }),
        new CopyPlugin({ //Plugin copiar imagenes a dist
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(), //Variables de entorno (dotenv-webpack)
        new CleanWebpackPlugin(), //Limpiar archivos(hash) de dist
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), //Optimizador css
            new TerserPlugin(), //Optimizador JavaScript
        ]
    }
}