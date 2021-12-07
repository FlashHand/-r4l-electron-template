import { Notification } from 'electron'
import { resolve } from 'path'
import env from '@/shared/tools/env'

interface Options {
	title?: string
	subtitle?: string
}

export class NotiCenter {
	private currentNotification?: Notification

	public show(message: string, options?: Options) {
		if (!Notification.isSupported()) {
			return
		}
		if (this.currentNotification) {
			this.currentNotification.close()
		}
		this.currentNotification = new Notification({
			title: options?.title || '融易算桌面客户端',
			body: message,
			subtitle: options?.subtitle || '',
			icon: resolve(env.staticPath, '/assets/images/icons/tray-logo.png')
		})
		this.currentNotification.show()
	}

}

const notification = new NotiCenter()
export default notification