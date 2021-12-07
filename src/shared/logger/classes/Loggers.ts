import deviceHelper from '@/shared/tools/device';
import winston from 'winston';
import moment from 'moment';
import path from 'path';
import env from '@/shared/tools/env';
import processor from '@/shared/tools/processor';
import application from '@/shared/tools/application';
import {mac} from '@/shared/tools/mac-address';
import pkg from '@/shared/tools/package';
import {Action} from '@/shared/logger';
import PathHelper from '@/shared/tools/PathHelper';

interface ApiData {
	endpoint: string;
	url: string;
	method: string;
	data?: any;
	params?: any;
	headers: { [key: string]: any };
	req?: any;
	res?: any;
}

export class Payload {
	udid = 'unknow';//唯一设备标识，
	account?: string;//账号，存在cookie里
	value?: number;//数值统计
	level: 'info' | 'error' = 'info';
	//以下是事件筛
	category = 'unknow';//事件类别category
	action?: string;//事件行为
	label?: string;//行为标签
	label1?: string;//行为标签
	label2?: string;//行为标签
	process: 'main' | 'server' | 'tb_webview' | 'unknow' = 'unknow';

	//以下是事件来源定位
	path?: string;//当前路径，不含hash，不是fullpath
	meta?: any;//路由元数据,页面中文名
	node?: string;//触发节点

	carrier?: any;//复杂信息载体
	apiTrace?: ApiData;//接口足迹，用来记录接口的数据交换
	sys?: string;//系统类型

	async init() {
		this.udid = deviceHelper.deviceIdSync();
	}

	constructor() {
		this.init();
	}
}

class RLogger {

	private localLogger: winston.Logger;

	private maxSize = 5000000;

	private maxFiles = 5;

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
		this.localLogger = this.createLogger()
	}

	public info(payload:Payload) {
		const payloadStr = JSON.stringify(payload);
		this.localLogger.info(payloadStr);
	}


	public warn(...message: any[]) {
		this.localLogger.warn(message.map(v => JSON.stringify(v)))
	}

	public error(...message: any[]) {
		this.localLogger.error(message.map(v => JSON.stringify(v)))
	}

	public action(action: Action, ...message: any[]) {
		this.localLogger.info(message.map(v => JSON.stringify(v)))
	}

	private createLogger(): winston.Logger {
		const filename = path.join(PathHelper.logPath, 'app.log');
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
					filename: filename,
					maxsize: this.maxSize,
					maxFiles: this.maxFiles,
				})
			],
			handleExceptions: true,
		})
		if (!env.isDebug) {
			logger.add(new winston.transports.Console())
		}
		return logger
	}
}

class MainLogger extends RLogger {
	initPayLoad(){
		const payload = new Payload();
		payload.process = 'main';
		return payload;
	}
	launchStatus(status:string){
		const payload = this.initPayLoad();
		payload.category = 'launchStatus';
		payload.action = 'launching';
		payload.label = status;
		this.info(payload);
	}

	constructor() {
		super();
	}

}
export const mainLogger = new MainLogger()

