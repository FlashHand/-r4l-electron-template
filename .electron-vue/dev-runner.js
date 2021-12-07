'use strict'

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const fs = require('fs')
const {program} = require('commander');
const {say} = require('cfonts')
const {spawn} = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const mainConfig = require('./webpack.main.config');
const WebpackRenderer = require('./webpack.renderer.config');
const utils = require('./utils');
const nativeHelper = require('./nativeHelper');
const parseWorkerConfig = require('./workers/webpack.worker.parse.config')

const JSON5 = require('json5')

let electronProcess = null
let manualRestart = false

function logStats(proc, data) {
	let log = ''
	log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((30 - proc.length) + 1).join('-')}`)
	log += '\n\n'

	if (typeof data === 'object') {
		data.toString({
			colors: true,
			chunks: false
		}).split(/\r?\n/).forEach(line => {
			log += '  ' + line + '\n'
		})
	} else {
		log += `  ${data}\n`
	}

	log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

	console.log(log)
}

const startCompile = (config, renderersPath = 'src/renderers') => {
	return new Promise((resolve, reject) => {
		let webpackConfig = new WebpackRenderer(config).exportConfig();
		const compiler = webpack(webpackConfig);
		compiler.run((err, stats) => {
			logStats(`Renderer ${config.name}`, stats)
			if (err) {
				reject(err.stack || err)
			} else if (stats.hasErrors()) {
				let err = ''
				stats.toString({
					chunks: false,
					colors: true
				})
					.split(/\r?\n/)
					.forEach(line => {
						err += `    ${line}\n`
					})
				reject(err)
			} else {
				resolve(compiler)
			}
		})
	})
}
const startRenderer = async (config, renderersPath = 'src/renderers') => {
	const compiler = await startCompile(config, renderersPath);
	const contentBase = path.join(__dirname, `../dist/electron/${config.name}`);
	const webpackDevServer = new WebpackDevServer(compiler,
		{
			contentBase,
			hot: true
		}
	).listen(config.devPort);
	webpackDevServer.on('error', err => {
		console.log('webpackDevServer', err);
	})
	console.log('startRenderer:', config, contentBase);

};

const startMain = (appConfig) => {
	return new Promise((resolve, reject) => {
		//通过appConfig的环境变量判断要不要启动某个进程
		const processConfigs = [];
		appConfig.renderers.forEach(rConfig => {
			let devDisable = false;
			if (program.mode && rConfig[`mode_${program.mode}`]) {
				devDisable = rConfig[`mode_${program.mode}`].devDisable;
			}
			//是否需要显示窗口
			if (rConfig[`mode_${program.mode}`] && rConfig[`mode_${program.mode}`].show) rConfig.show = true;
			if (!devDisable) {
				processConfigs.push(rConfig);
			}
		})

		mainConfig.plugins.push(
			new webpack.DefinePlugin({
				'process.env.PROCESS_CONFIGS': JSON5.stringify(processConfigs)
			})
		)
		webpack(mainConfig).run((err, stats) => {
			logStats('Main', stats)
			if (err) {
				reject(err.stack || err)
			} else if (stats.hasErrors()) {
				let err = ''
				stats.toString({
					chunks: false,
					colors: true
				})
					.split(/\r?\n/)
					.forEach(line => {
						err += `    ${line}\n`
					})
				reject(err)
			} else {
				resolve(stats.toString({
					chunks: false,
					colors: true
				}))
			}
		})
	})

}

function startElectron() {
	electronProcess = spawn(electron, ['--inspect=5858', '.'])

	electronProcess.stdout.on('data', data => {
		electronLog(data, 'blue')
	})

	electronProcess.stderr.on('data', data => {
		electronLog(data, 'red')
	})

	electronProcess.on('close', () => {
		if (!manualRestart) process.exit()
	})
}

function startWorker(config) {
	return new Promise((resolve, reject) => {
		webpack(config).run((err, stats) => {
			logStats('Worker', stats)
			if (err) {
				reject(err.stack || err)
			} else if (stats.hasErrors()) {
				let err = ''
				stats.toString({
					chunks: false,
					colors: true
				})
					.split(/\r?\n/)
					.forEach(line => {
						err += `    ${line}\n`
					})
				reject(err)
			} else {
				resolve(stats.toString({
					chunks: false,
					colors: true
				}))
			}
		})
	})
}

function startWorker(config) {
	return new Promise((resolve, reject) => {
		webpack(config).run((err, stats) => {
			logStats('Worker', stats)
			if (err) {
				reject(err.stack || err)
			} else if (stats.hasErrors()) {
				let err = ''
				stats.toString({
					chunks: false,
					colors: true
				})
					.split(/\r?\n/)
					.forEach(line => {
						err += `    ${line}\n`
					})
				reject(err)
			} else {
				resolve(stats.toString({
					chunks: false,
					colors: true
				}))
			}
		})
	})
}

function electronLog(data, color) {
	data = data.toString().split(/\r?\n/)
	let log = data.join('\n')
	if (log[log.length - 1] === '\n') {
		log = log.slice(0, log.length - 1)
	}
	if (/[0-9A-z]+/.test(log)) {
		console.log(chalk[color].bold(log))
	}
}

function greeting() {
	const cols = process.stdout.columns
	let text = ''

	if (cols > 104) text = 'electron-vue'
	else if (cols > 76) text = 'electron-|vue'
	else text = false

	if (text) {
		say(text, {
			colors: ['yellow'],
			font: 'simple3d',
			space: false
		})
	} else console.log(chalk.yellow.bold('\n  electron-vue'))
	console.log(chalk.blue('  getting ready...') + '\n')
}

//初始化dev服务，并启动electron
async function init() {
	greeting()
	nativeHelper.overwrite();
	try {
		const mode = program.mode;
		//构建worker代码
		//读取渲染进程组文件
		const appConfig = utils.readAppConfig();
		//生成各个进程
		for (let rConfig of appConfig.renderers) {
			let devDisable = false;
			if (mode && rConfig[`mode_${mode}`]) {
				//如果存在有效的mode命令行变量
				devDisable = rConfig[`mode_${mode}`].devDisable;
			}
			if (!devDisable) {
				await startRenderer(rConfig);
			}
		}
		await startWorker(parseWorkerConfig);

		//构建启动各个进程资源服务
		// for (let r of renderers) {
		// 	await r();
		// }
		await startMain(appConfig);
		startElectron()
	} catch (err) {
		console.log('init error:', err)
		process.exit()
	}
}

program.option('-m, --mode <mode>', '调试时启动的模式，可用来控制进程的启动', '');

program.option('-i, --invoice', '是否开启发票破解进程', false);
program.option('-t, --tb_webview', '是否开启税局自动登录进程', false);
program.parse(process.argv);
init()
