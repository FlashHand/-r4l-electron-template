import {
	autoUpdater
} from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';
import {timer} from 'r-foundation';
autoUpdater.setFeedURL(process.env.FEED_URL!);
let mainWin: BrowserWindow;
let isUpdating = false;
//向主窗口发送消息
const sendUpdateMessage = (text: any) => {
	mainWin?.webContents.send('message', text)
}
//监听升级失败事件
autoUpdater.on('error', error => {
	isUpdating = false;
	sendUpdateMessage({
		cmd: 'error',
		message: error
	})
});
//监听开始检测更新事件
autoUpdater.on('checking-for-update', message => {
	sendUpdateMessage({
		cmd: 'checking-for-update',
		message: message
	})
});
//监听发现可用更新事件
autoUpdater.on('update-available', message => {
	isUpdating = true;
	sendUpdateMessage({
		cmd: 'update-available',
		message: message
	})
});
//监听没有可用更新事件
autoUpdater.on('update-not-available', message => {
	isUpdating = false;
	sendUpdateMessage({
		cmd: 'update-not-available',
		message: message
	})
});

// 更新下载进度事件
autoUpdater.on('download-progress', progressObj => {
	sendUpdateMessage({
		cmd: 'download-progress',
		message: progressObj
	})
});
//监听下载完成事件
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl) => {
	sendUpdateMessage({
		cmd: 'update-downloaded',
		message: {
			releaseNotes,
			releaseName,
			releaseDate,
			updateUrl
		}
	})
	//退出并安装更新包
	autoUpdater.quitAndInstall(false,false);
});

const checkUpdate = (win: BrowserWindow) => {
	mainWin = win;

	//接收渲染进程消息，开始检查更新
	ipcMain.on('checkForUpdate', (e, arg) => {
		//执行自动更新检查
		// sendUpdateMessage({cmd:'checkForUpdate',message:arg})
		autoUpdater.checkForUpdates();
	});
}

/**
 * @desc 开始检查更新，递归检查
 */

const startChecking = async (win?: BrowserWindow) => {
	console.log('开始检查更新');

	if (win) mainWin = win;
	console.log('开始检查更新');
	if (isUpdating) return;
	//开始检查更新
	try {
		const res = await autoUpdater.checkForUpdates();
		// console.log(res);
		//等待10秒
		await timer.delay(10000);
		await startChecking();
	} catch (e) {
		console.log('check err', e);
	}
}
export default {
	startChecking
}
