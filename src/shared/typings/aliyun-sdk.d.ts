declare module 'aliyun-sdk' {
	export interface SLSOptions {
		accessKeyId: string
		secretAccessKey: string
		endpoint: string
		apiVersion: string
	}
	export interface Log {
		time: number
		contents: Array<any>
	}

	export interface LogGroup {
		logs: Array<Log>
		topic: string
		source: string
	}

	export interface LogOptions {
		projectName: string
		logStoreName: string
		logGroup: LogGroup
	}

	class SLS {
		constructor(options: SLSOptions)

		public putLogs(options: LogOptions, cb: (err: Error, data: any) => void): any
	}


}
