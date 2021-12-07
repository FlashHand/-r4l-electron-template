import winston from 'winston'
import path from 'path'
import moment from 'moment'
import env from '../tools/env'
import deviceHelper from '../tools/device'
import pkg from '@/shared/tools/package'
import processor from '../tools/processor'
import { mac } from '../tools/mac-address'
import application from '../tools/application'

export enum Action {
	normal = 'normal',
	launched = 'launched',
	loginStart = 'loginStart',
	loginOK = 'loginOK',
	loginFailed = 'loginFailed',
	extractStart = 'extractStart',
	extractOK = 'extractOK',
	extractFailed = 'extractFailed',
	extractedAll = 'extractedAll',
	syncApplyRecordsStart = 'syncApplyRecordsStart',
	syncApplyRecordsFailed = 'syncApplyRecordsFailed',
	syncApplyRecordsOK = 'syncApplyRecordsOK',
	syncApplyRecordsRestart = 'syncApplyRecordsRestart',
	downloadExcelOK = 'downloadExcelOK',
	downloadExcelFailed = 'downloadExcelFailed',
	extractExcelOK = 'extractExcelOK',
	extractExcelFailed = 'extractExcelFailed',
	markedData = 'markedData'
}

export interface MyLog {
	level: 'info' | 'warn' | 'error',
	message: any,
	action: Action
	process: 'invoice' | 'main'
}

class Logger {

	private myLogger: winston.Logger

	private maxSize = 5000000

	private maxFiles = 5

	private config = {
		colors: {
			error: 'red',
			debug: 'blue',
			warn: 'yellow',
			data: 'grey',
			info: 'green',
			verbose: 'cyan',
			silly: 'magenta',
			custom: 'yellow'
		}
	}

	constructor() {
		winston.addColors(this.config.colors)
		this.myLogger = this.createLogger()
	}

	public info(...message: any[]) {
		this.send('info', undefined, ...message)
		this.myLogger.info(message.map(v => JSON.stringify(v)))
	}

	public warn(...message: any[]) {
		this.send('warn', undefined, ...message)
		this.myLogger.warn(message.map(v => JSON.stringify(v)))
	}

	public error(...message: any[]) {
		this.send('error', undefined, ...message)
		this.myLogger.error(message.map(v => JSON.stringify(v)))
	}

	public action(action: Action, ...message: any[]) {
		this.send('info', action, ...message)
		this.myLogger.info(message.map(v => JSON.stringify(v)))
	}

	private createLogger(): winston.Logger {
		const logger = winston.createLogger({
			levels: {
				error: 0,
				warn: 1,
				info: 2,
			},
			format: winston.format.combine(
				winston.format.printf(info => {
					return `[${info.level}] [${moment().format('YYYY-MM-DD HH:mm:ss')}] ${info.message}`
				}),
				winston.format.colorize()
			),
			transports: [
				new winston.transports.File({
					filename: path.resolve(env.logPath, '/app.log'),
					level: 'info',
					maxsize: this.maxSize,
					maxFiles: this.maxFiles,
				})
			],
			handleExceptions: true,
		})
		if (!env.isBinary) {
			logger.add(new winston.transports.Console())
		}
		return logger
	}

	private async send(level: 'info' | 'warn' | 'error', action: Action = Action.normal, ...message: any[]) {
		const deviceId = await deviceHelper.deviceId()
		const processonId = await processor.getProcessorID()
		application.extension.sls.putLogs([
			{
				level,
				message: JSON.stringify(message),
				action,
				uuid: deviceId,
				process: process.env.PROCESS_NAME,
				certificate: application.extension.certificate,
				mac: mac.get(),
				version: pkg.version,
				processonId
			}
		])
	}

}

const logger = new Logger()
export default logger
