const fs = require('fs');
const path = require('path');
const envTool = require('./envTool');
console.log('native env：', process.env.NODE_ENV);
const currentEnv = envTool[process.env.NODE_ENV];
const ifsEndpoint = currentEnv.IFS_ENDPOINT;
const token = currentEnv.TOKEN;

const overwrite = () => {
	const buffer = fs.readFileSync(path.join(__dirname, './nativeTemplate.xml'));
	let configXml = buffer.toString();
	configXml = configXml.replace('$$ENDPOINT', ifsEndpoint);
	configXml = configXml.replace('$$TOKEN', token);

	console.log('native configs', currentEnv,configXml);
	debugger;
	fs.writeFileSync(path.join(__dirname, '../static/natives/config.xml'), configXml);
}
module.exports = {
	overwrite
}
