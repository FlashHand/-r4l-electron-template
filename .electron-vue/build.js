'use strict'

const {say} = require('cfonts');
const chalk = require('chalk');
const del = require('del');
const webpack = require('webpack');
const Multispinner = require('multispinner');
const JSON5 = require('json5');
const appConfigHelper = require('./appConfigHelper');
const WebpackRenderer = require('./webpack.renderer.config');

const mainConfig = require('./webpack.main.config')
const parseWorkerConfig = require('./workers/webpack.worker.parse.config')

const doneLog = chalk.bgGreen.white(' DONE ') + ' '
const errorLog = chalk.bgRed.white(' ERROR ') + ' '
const okayLog = chalk.bgBlue.white(' OKAY ') + ' '
const isCI = process.env.CI || false


const clean = () => {
	del.sync(['build/*', '!build/assets', '!build/icons', '!build/icons/icon.*'])
	console.log(`\n${doneLog}\n`)
	process.exit()
}
const nativeHelper = require('./nativeHelper');

const build = async () => {
	greeting()
	nativeHelper.overwrite();

	del.sync(['dist/electron/*', '!.gitkeep'])
	const appConfig = appConfigHelper.readAppConfig();

	const processConfigs = [];
	const webpackConfigs = [];
	appConfig.renderers.forEach(rConfig => {
		if (rConfig.launch) {
			processConfigs.push(rConfig);
		}
		webpackConfigs.push(new WebpackRenderer(rConfig, appConfig.renderersPath).exportConfig());
	});
	//PROCESS_CONFIGS存放了启动进程，随着应用启动
	mainConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env.PROCESS_CONFIGS': JSON5.stringify(processConfigs)
		})
	)
	const tasks = [

	];
	webpackConfigs.forEach(webpackConfig => {
		tasks.push([`${webpackConfig.name}`, webpackConfig]);
	})
	tasks.push(['worker', parseWorkerConfig]);
	tasks.push(['main', mainConfig]);

	const m = new Multispinner(tasks.map(t => t[0]), {
		preText: 'building',
		postText: 'process'
	})

	let results = ''

	m.on('success', () => {
		process.stdout.write('\x1B[2J\x1B[0f')
		console.log(`\n\n${results}`)
		console.log(`${okayLog}take it away ${chalk.yellow('`electron-builder`')}\n`)
	})

	for (const task of tasks) {
		try {
			const result = await pack(task[1])
			results += result + '\n\n'
			m.success(task[0])
		} catch (err) {
			m.error(task[0])
			console.log(`\n  ${errorLog}failed to build ${task[0]} process`)
			console.error(`\n${err}\n`)
			process.exit(1)
		}
	}
}
const pack = (config) => {
	return new Promise((resolve, reject) => {
		delete config.devtool
		webpack(config).run((err, stats) => {
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

const greeting = () => {
	const cols = process.stdout.columns
	let text = ''

	if (cols > 85) text = 'lets-build'
	else if (cols > 60) text = 'lets-|build'
	else text = false

	if (text && !isCI) {
		say(text, {
			colors: ['yellow'],
			font: 'simple3d',
			space: false
		})
	} else console.log(chalk.yellow.bold('\n  lets-build'))
}

if (process.env.BUILD_TARGET === 'clean') clean()
// else if (process.env.BUILD_TARGET === 'web') web()
else build()
