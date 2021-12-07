// import {remote} from 'electron';

import env from '@/shared/tools/env'

const remote = window.require('electron').remote
const app = remote.app
const path = window.require('path')

// 获取应用目录
const getAppPath = () => {
	return app.getAppPath()
}
const getResourcesPath = () => {
	let resourcesPath = getStaticPath()
	if (env.isBinary) {
		resourcesPath = path.resolve(getAppPath(), '..')
	}
	return resourcesPath
}
const getStaticPath = () => {
	const appPath = getAppPath()
	console.log('appPath', appPath, path.join(appPath, '../'), appPath.replace('/app.asar', ''))
	let staticPath = path.resolve(appPath, 'static')
	if (env.isBinary) {
		staticPath = path.join(appPath, '../', 'static')
	}
	return staticPath
}
const getNativesPath = () => {
	const staticPath = getStaticPath()
	return path.resolve(staticPath, 'natives')
}
const getTmpPath = () => {
	const staticPath = getStaticPath()
	return path.join(staticPath, 'tmp')
}
// 获取文档文件夹目录
const getDocumentPath = () => {
	return app.getPath('documents')
}
// 获取存放用户数据的目录
const getUserDataPath = () => {
	return app.getPath('userData')
}

export default {
	getAppPath,
	getDocumentPath,
	getUserDataPath,
	getStaticPath,
	getNativesPath,
	getTmpPath,
	getResourcesPath
}
