import 'electron'
import { SLS } from '@/shared/tools/sls'
import { NotiCenter } from '@/shared/tools/notification'

declare module 'electron' {
	interface WebContents {
		getWebPreferences(): WebPreferences
		// correct the declaration
		on(event: 'did-start-navigation', listener: (
			ev: Event,
			url: string,
			isInPlace: boolean,
			isMainFrame: boolean,
			frameProcessId: number,
			frameRoutingId: number) => void): this


		removeListener(event: 'did-start-navigation', listener: (
			ev: Event,
			url: string,
			isInPlace: boolean,
			isMainFrame: boolean,
			frameProcessId: number,
			frameRoutingId: number) => void): this
	}
	interface App {
		EXTENSION: {
			sls: SLS
			certificate: string
			notification: NotiCenter
		}
	}

	// interface WebPreferences {
	//     preloadURL?: string
	//     nodeConfig?: NodeConfig
	// }
}
