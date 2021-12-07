import {join, resolve} from 'path'
import appHelper from '@/shared/tools/appHelper'

const app = appHelper.getApp();
import env from './env'
import path from 'path';

class PathHelper {
	public static get appPath() {
		return app.getAppPath()
	}

	public static get getResourcesPath() {
		let resourcesPath = PathHelper.staticPath

		if (env.isBinary) {
			resourcesPath = join(PathHelper.appPath, '..')
		}
		return resourcesPath
	}

	public static get staticPath() {
		let staticPath = join(PathHelper.appPath, 'static')

		if (env.isBinary) {
			staticPath = join(PathHelper.appPath, '..', 'static')
		}
		return staticPath
	}

	public static get getTmpPath() {
		return join(PathHelper.staticPath, 'tmp')
	}

	/**
	 * @desc 获取natives的路径
	 * @returns {string}
	 */
	public static get nativesPath() {
		return join(PathHelper.staticPath, 'natives')
	}

	/**
	 * @desc 获取natives的路径
	 * @returns {string}
	 */
	public static get scriptsPath() {
		return join(PathHelper.staticPath, 'scripts')
	}

	// 获取文档文件夹目录
	public static get documentPath() {
		return app.getPath('documents')
	}

	// 获取存放用户数据的目录
	public static get userDataPath() {
		return app.getPath('userData')
	}

	// 获取用户设备信息目录
	public static get deviceInfoPath() {
		return join(PathHelper.userDataPath, '.6875ADA60BCEF4EB');
	}

	//如果是调试的话就把log放到static下，如果是生产环境应该放到userData下
	public static get logPath(): string {

		return env.isDebug
			? join(PathHelper.staticPath, 'logs')
			: join(PathHelper.userDataPath, 'logs');
	}

}

export default PathHelper
