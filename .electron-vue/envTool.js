const _ = require('lodash');
const basicEnv = {
	APP_NAME: 'R4L',
	OEM: 'default',
	OFFICIAL: 'https://www.rys.com',
	TOKEN: '',
	IFS_ENDPOINT: 'https://uaa-gateway.rys.com/ifs',
	FEED_URL: 'https://cdn.rys.com/desktop/main/'
}
const dev = _.merge({}, basicEnv, {});
//NOTE:merge时，basicEnv在前，自定义在后，优先用自定义的

//test环境
const test = _.merge({}, {}, basicEnv);
const test_ydz = _.merge({}, {}, basicEnv);

//test2环境
const test2 = _.merge({}, basicEnv, {
	API_ROOT: 'https://test2-uaa.rys.cn',

});
//pre环境
const pre = _.merge({}, basicEnv, {
	API_ROOT: 'https://pre-uaa.rys.com',
	IFS_ENDPOINT: 'https://pre-uaa.rys.com/ifs',
});
//生产环境
const prod = _.merge({}, basicEnv, {
	API_ROOT: 'https://uaa-gateway.rys.com',

});
console.log(basicEnv);

const prod_ydz = _.merge({}, basicEnv, {
	OEM: 'ydz',
	API_ROOT: 'https://uaa-gateway.rys.com',
	APP_NAME: '账三丰',
	OFFICIAL: 'http://www.yundaizhang.com/',
	TOKEN: 'RVDB4TEU7XOZNMIKQLJH2WAYS95FG810',
	IFS_ENDPOINT: 'https://uaa-gateway.rys.com/ifs',//云代账渠道数据标识
	FEED_URL: 'https://cdn.rys.com/desktop/yundaizhang/binary/dist/'
});
const envDict = {
	dev,
	test,
	test_ydz,
	test2,
	prod,
	pre,
	prod_ydz,

}
const exportDefines = (envType) => {
	const env = envDict[envType];
	console.log('当前环境', envType, env);
	const defines = {};
	for (let key in env) {
		defines[`process.env.${key}`] = JSON.stringify(env[key]);
	}
	return defines;
};

module.exports = {
	...envDict,
	exportDefines
}
