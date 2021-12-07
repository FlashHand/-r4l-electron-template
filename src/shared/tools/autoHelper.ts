import {timer} from 'r-foundation';

/**
 * 异步重试函数，通过为error增加stopRetry = true,可以终结重试
 * @param {() => any} fn
 * @param {{interval: number, timeout: number}} opt
 * @returns {Promise<any>}
 */
async function asyncRetry(fn: () => any, opt = {timeout: 30000, interval: 100}) {
	const timeout = opt.timeout || 10000;//默认超时时间30秒
	const interval = opt.interval || 100;//默认超时时间30秒
	let duration = 0;
	const exec: (fn: () => any) => any = async (fn: () => any) => {
		let ret;
		let err;
		try {
			ret = await fn();
		} catch (e) {
			err = e;
		}
		if (err) {
			//如果函数执行错误
			await timer.delay(interval);
			duration += interval;
			if (duration > timeout || err.stopRetry) {
				//如果函数执行错误-且超时
				throw err;
			}
			return await exec(fn);
		}
		return ret;
	}
	return await exec(fn);
}

export default {
	asyncRetry
}
