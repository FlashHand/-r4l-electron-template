import regedit from 'regedit'
import { dirname, resolve } from 'path'
import env from './env'

class Regedit {
	constructor() {

		if (env.isBinary) {
			// make vbs available for regedit when run in prod
			regedit.setExternalVBSLocation(resolve(process.resourcesPath!, 'static/vbs'))
		}
	}
	public async read(): Promise<string> {
		const keyPath64 = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\融易算发票采集工具'
		const keyPath32 = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\融易算发票采集工具'
		try {
			const dir = await this.list(keyPath32)
			return dir
		} catch (e) {
			const dir = await this.list(keyPath64)
			return dir
		}
	}

	private async list(keyPath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			regedit.list(keyPath, (err: any, res: any) => {
				if (err) {
					reject(err)
				} else {
					const uninstallString = res[keyPath]['values']['UninstallString']['value']
					resolve(dirname(uninstallString))
				}
			})
		})
	}
}

export const regedits = new Regedit()
