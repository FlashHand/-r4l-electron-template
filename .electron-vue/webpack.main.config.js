'use strict'

const path = require('path')
const {dependencies} = require('../package.json')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const envTool = require('./envTool');
const inAppEnv = envTool[process.env.NODE_ENV];
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin")

let mainConfig = {
	mode: 'none',
	entry: {
		main: path.join(__dirname, '../src/main/index.ts')
	},
	externals: [
		...Object.keys(dependencies || {}),
		'electron-debug'
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						experimentalWatchApi: true
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.node$/,
				use: 'node-loader'
			}
		]
	},
	node: {
		__dirname: process.env.DEBUG ==='true',
		__filename: process.env.DEBUG ==='true'
	},
	output: {
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		path: path.join(__dirname, '../dist/electron')
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
			})
		]
	},
	plugins: [
		new ESLintWebpackPlugin({
			context: path.join(__dirname, '../src'),
			extensions: ['.ts', '.js'],
			fix: true
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new CopyWebpackPlugin(
			{
				patterns:
					[
						{
							from: path.join(__dirname, '../static'),
							to: path.join(__dirname, '../dist/electron/static'),
							globOptions: {
								dot: true,
								gitignore: true,
								ignore: ["**/InvoiceAssistant.db"],
							},
						}
					]
			}
		),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
			'process.env.PROCESS_NAME': "'main'",
			...(envTool.exportDefines(process.env.NODE_ENV))
		}),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json', '.node'],
		alias: {
			'@': path.join(__dirname, '../src'),
			'@shared': path.join(__dirname, '../src/shared'),
			'@static': path.join(__dirname, '../static'),
			'@root': path.join(__dirname, '../'),
		},
	},
	target: 'electron-main'
}

module.exports = mainConfig
