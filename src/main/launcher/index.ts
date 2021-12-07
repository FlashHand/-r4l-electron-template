// 默认进程组，console,server是必须启动的
import env from '@/shared/tools/env'
import {app, BrowserWindow, session} from 'electron'

interface ProcessConfig {
	name: string;
	devPort: number;
	show: boolean;
	height?: number;
	width?: number;
	minHeight?: number;
	minWidth?: number;
	frame?: boolean;
}

interface WebInfo {
	areaCode: string;//网址
	taxCode: string;//税号
	pwd: string;//税局密码
	staff: string;
	staffName: string; // 办税人
	staffPwd: string; // 办税人密码
	account: string; // 账号
}

const minHeight = 700;
const minWidth = 1280;

const winMap = new Map<string, BrowserWindow>()


class Launcher {
	static winMap = new Map<string, BrowserWindow>()

	public start() {
		process.env.PROCESS_CONFIGS.forEach(config => {
			const win = this.createWin(config)
			winMap.set(config.name, win)
		});
	}

	private createWin(config: ProcessConfig) {
		const entryUrl = env.isBinary
			? `file://${__dirname}/${config.name}/index.html`
			: `http://localhost:${config.devPort}`
		const win = new BrowserWindow({
			height: config.height || minHeight,
			width: config.width || minWidth,
			minHeight: config.minHeight || minHeight,
			minWidth: config.minWidth || minWidth,
			show: config.show ?? !env.isBinary,
			webPreferences: {
				enableRemoteModule: true, //激活remote模块
				webSecurity: false,
				nodeIntegration: true,
				contextIsolation: false,
				nodeIntegrationInWorker: true,
			},
			frame: config.frame || false
		})
		console.log(`${config.name}-entryUrl:`, entryUrl)
		win.loadURL(entryUrl)
		if (env.isDebug) {
			win.webContents.openDevTools()
		} else {
			win.setMenuBarVisibility(false)
		}
		win.on('minimize', (e: Event) => {
			e.preventDefault()
			win.hide()
		})
		win.on('close', (e: Event) => {
			e.preventDefault()
			win.hide()
		})
		return win
	}

}

export const launcher = new Launcher()
