/**
 * @ignore
 * @Description nothing
 * @author Wang Bo (ralwayne@163.com)
 * @date 2021/4/13 3:04 PM
 */

const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')

const TerserPlugin = require("terser-webpack-plugin")
const path = require('path')
const {dependencies} = require('../package.json')
const webpack = require('webpack');

let whiteListedModules = ['vue'];
const envTool = require('./envTool');
const inAppEnv = envTool[process.env.NODE_ENV];

class WebpackRenderer {
	static renderersPath = 'src/renderers';
	name = 'unset';
	entry = {}
	devtool = 'eval';
	externals = [
		...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
	]
	module = {
		rules: []
	}
	plugins = []
	output = {
		clean: true,
		libraryTarget: 'commonjs2',
		path: path.join(__dirname, '../dist/electron')
	}
	resolve = {
		alias: {
			'@': path.join(__dirname, '../src'),
			'@shared': path.join(__dirname, '../src/shared'),
			'@static': path.join(__dirname, '../static'),
			'@root': path.join(__dirname, '../'),
			'vue$': 'vue/dist/vue.runtime.esm.js',
		},
		aliasFields: ['browser'],
		extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.css', '.node']
	}
	node = {
		__dirname: process.env.DEBUG === 'true',
		__filename: process.env.DEBUG === 'true'
	}
	target = 'electron-renderer'

	constructor(option) {
		this.name = option.name;
		this.entry = {
			renderer: path.join(__dirname, `../${WebpackRenderer.renderersPath}/${this.name}/main.ts`)
		}
		console.log('entry', this.entry);
		this.output.path = path.join(__dirname, `../dist/electron/${this.name}`)
		this.output.filename = `[name].js`;
		//设置模块默认规则
		this.setupDefaultRules();
		//设置默认插件组
		this.setupDefaultPlugins();
	}

	exportConfig() {
		return {
			mode: 'none',
			name: this.name,
			entry: this.entry,
			devtool: this.devtool,
			externals: this.externals,
			module: this.module,
			plugins: this.plugins,
			optimization: {
				minimizer: [
					new TerserPlugin({
						parallel: true,
					})
				]
			},
			output: this.output,
			resolve: this.resolve,
			node: this.node,
			target: this.target
		}
	}

	setupDefaultRules() {
		this.module.rules = [
			{
				test: /\.(png|svg|jpg|jpeg|gif|woff|ttf)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false,
							name: '[name].[ext]',
							publicPath: './assets/',
							outputPath: 'assets/',
						}
					},
				],
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.(css|scss|styl|less)$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.node$/,
				use: 'node-loader',
			},
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						appendTsSuffixTo: [/\.vue$/],
						transpileOnly: true,
						experimentalWatchApi: true
					}
				},
				exclude: /node_modules/,
			}
		]
	}

	setupDefaultPlugins() {
		this.plugins = [
			new VueLoaderPlugin(),
			new ESLintWebpackPlugin({
				context: path.join(__dirname, '../src'),
				extensions: ['.ts', '.vue', '.js'],
				fix: true
			}),
			new MiniCssExtractPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin({
				filename: `index.html`,
				appName: inAppEnv.APP_NAME,
				template: path.resolve(__dirname, `../${WebpackRenderer.renderersPath}/${this.name}/index.ejs`),
				minify: {
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true
				},
				templateParameters: (compilation, assets, assetsTag, options) => {
					return {
						compilation: compilation,
						webpack: compilation.getStats().toJson(),
						webpackConfig: compilation.options,
						htmlWebpackPlugin: {
							files: assets,
							options: options
						},
						process,
					}
				},
				nodeModules: process.env.DEBUG === 'true'
					? path.resolve(__dirname, '../node_modules')
					: false
			}),
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.PROCESS_NAME': JSON.stringify(this.name),
				...(envTool.exportDefines(process.env.NODE_ENV))
			}),
		];

		if (process.env.DEBUG !== 'true') {
			this.devtool = ''
			this.plugins.push(
				new webpack.LoaderOptionsPlugin({
					minimize: true
				})
			)
		}
	}
}

module.exports = WebpackRenderer;
