import {remote, app, App} from 'electron'

const getApp = (): App => {
	return app || remote.app;
}


export default {
	getApp
}
