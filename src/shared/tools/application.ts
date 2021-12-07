import { remote, app, App } from 'electron'

class Application {
	public get(): App {
		return app || remote.app
	}

	public get extension() {
		return this.get().EXTENSION
	}
}

const application = new Application()

export default application
