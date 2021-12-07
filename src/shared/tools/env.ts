import { resolve } from 'path'


class ENV {
	private env: string;
	private debug: string|undefined;
	constructor() {
		this.env = process.env.NODE_ENV;
		this.debug = process.env.DEBUG;
	}

	public get name(): string {
		return process.env.NODE_ENV;
	}

	public get isDebug(): boolean {
		return this.debug === 'true';
	}
	public get isBinary(): boolean {
		return process.env.DEBUG !== 'true';
	}

	public get isTest2(): boolean {
		return this.name == 'test2'
	}

	public get isDev(): boolean {
		return this.name == 'dev'
	}

	public get isPre(): boolean {
		return this.name == 'pre'
	}

	public get isProd(): boolean {
		return this.name == 'prod'
	}

	public get rawName(): string {
		return this.env
	}

	public get staticPath(): string {

		return this.isBinary
			? resolve(process.resourcesPath!, 'static')
			: resolve(__dirname, '../../../static')
	}

	public get logPath(): string {

		return this.isBinary
			? resolve(process.resourcesPath!, 'static/logs')
			: resolve(__dirname, '../../../logs')
	}

}

const env = new ENV()
export default env
