import path from 'path'
import fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import mkdirp from 'mkdirp'

import PathHelper from '@/shared/tools/PathHelper'
import CryptoHelper from '@/shared/tools/CryptoHelper'
import {promisify} from 'util'
import FsHelper from './FsHelper';

const fsExsits = promisify(fs.exists)
const fsWriteFile = promisify(fs.writeFile)
const fsReadFile = promisify(fs.readFile)

class DeviceHelper {
	readonly udidFilePath: string
	readonly deviceDir: string

	private udid?: string

	constructor() {
		this.deviceDir = PathHelper.deviceInfoPath;
		this.udidFilePath = path.join(this.deviceDir, '.00F3ACDDD00FA671');
	}

	public async generateDeviceId() {
		const exists = await fsExsits(this.deviceDir)
		if (!exists) {
			await mkdirp(this.deviceDir, 777)
			const fileExsists = await fsExsits(this.udidFilePath)
			if (!fileExsists) {
				const udidStr = uuidv4()
				await fsWriteFile(this.udidFilePath, udidStr)
			}
		}
	}

	public async deviceId() {
		if (this.udid) {
			return this.udid
		}
		await this.generateDeviceId()
		const deviceIdBuf = await fsReadFile(this.udidFilePath)
		this.udid = CryptoHelper.sha1(deviceIdBuf.toString())
		return this.udid
	}

	public generateDeviceIdSync() {
		const exists = fs.existsSync(this.deviceDir);
		if (!exists) {
			FsHelper.mkdirsSync(this.deviceDir)
			const fileExsists = fs.existsSync(this.udidFilePath)
			if (!fileExsists) {
				const udidStr = uuidv4()
				fs.writeFileSync(this.udidFilePath, udidStr,{mode: '777'})
			}
		}
	}

	public deviceIdSync() {
		if (this.udid) {
			return this.udid
		}
		this.generateDeviceIdSync()
		const deviceIdBuf = fs.readFileSync(this.udidFilePath);
		this.udid = CryptoHelper.sha1(deviceIdBuf.toString())
		return this.udid
	}
}

const deviceHelper = new DeviceHelper()
export default deviceHelper
