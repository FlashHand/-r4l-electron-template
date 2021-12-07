import Vue, { VNode } from 'vue'

declare global {

	namespace JSX {
		// tslint:disable no-empty-interface
		type Element = VNode
		// tslint:disable no-empty-interface
		type ElementClass = Vue
		interface IntrinsicElements {
			[elem: string]: any
		}
	}

	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'prod' | 'pre' | 'dev'
			PROCESS_NAME: string
			PROCESS_CONFIGS: {
				name: string
				devPort: number
				show: boolean
			}[]
		}
	}

}
