const path = require('path');
const fs = require('fs');
const JSON5 = require('json5')

const readAppConfig = ()=>{
	const configPath = path.join(__dirname, `../app.config.json5`);
	return JSON5.parse(fs.readFileSync(configPath));
}
module.exports = {
	readAppConfig
}
