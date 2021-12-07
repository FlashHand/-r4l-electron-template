import { app, protocol, Tray, Menu } from 'electron'
import { launcher } from './launcher'
import env from '@/shared/tools/env'
import sls from '@/shared/tools/sls'
import notification from '@/shared/tools/notification'
const singletonLock = app.requestSingleInstanceLock();
if (!singletonLock) {
	app.quit();
}else{
	app.on('second-instance',()=>{

	})
}
app.EXTENSION = {
	sls,
	notification,
	certificate: ''
}

//app life circle
app.on('ready', () => {
	if (env.isBinary) {

	}
	launcher.start();

})

app.on('activate', () => {
})



