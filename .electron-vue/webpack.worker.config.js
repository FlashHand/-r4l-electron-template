const ESLintWebpackPlugin = require('eslint-webpack-plugin')

const TerserPlugin = require("terser-webpack-plugin")
const path = require('path')
const webpack = require('webpack');

class WebpackRenderer {
    name = 'unset';
    entry = {}
    devtool = 'eval';
    module = {
        rules: []
    }
    plugins = []
    output = {
        clean: false,
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist/electron/invoice')
        // path: path.join(__dirname, '../src/worker')
    }
    resolve = {
        alias: {
            '@': path.join(__dirname, '../src'),
            '@shared': path.join(__dirname, '../src/shared'),
            '@static': path.join(__dirname, '../static'),
            '@root': path.join(__dirname, '../')
        },
        aliasFields: ['browser'],
        extensions: ['.js', '.json', '.ts', '.tsx', '.node']
    }
    node = {
        __dirname: process.env.DEBUG ==='true',
        __filename: process.env.DEBUG === 'true'
    }
    target = 'node'

    constructor(option) {
        this.name = option.name;
        this.entry = path.join(__dirname, `../src/workers/${this.name}.ts`)
        // this.output.path = path.join(__dirname, `../static/workers`)
        this.output.path = path.join(__dirname, '../dist/electron/invoice')

        this.output.filename = `${this.name}.js`;
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
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    }

    setupDefaultPlugins() {
        this.plugins = [
            new ESLintWebpackPlugin({
                context: path.join(__dirname, '../src/worker'),
                extensions: ['.ts', '.js'],
                fix: true
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.PROCESS_NAME': `'${this.name}'`
            })
        ];

        if (process.env.DEBUG !=='true') {
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
