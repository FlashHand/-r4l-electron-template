import {BasicClient} from 'r-networking';
import errHandler from '@/shared/networking/mws/local/invoiceHelper/errHandler';

const bc = new BasicClient({
	//TODO 改到配置文件
	// baseURL: 'https://test2-uaa.rys.cn/tax-console'
	baseURL: 'https://gateway.rys.com/tax-console'
	// baseURL: 'https://pre-gateway.rys.com/tax-console'

}, [], [errHandler]);

//排队(预约锁)
const apply = (params: any) => bc.createPostJSON('/sms-web/apply', params);
//检查锁定状态
const check_lock_status = (params: any) => bc.createPostJSON('/sms-web/checkUse', params);
//获取所有短信验证码
const query_all_sms = (params: any) => bc.createPostJSON('/sms-web/getCodes', params);
//解锁
const unlock = (params: any) => bc.createPostJSON('/sms-web/verified', params);


export default {
	apply,
	check_lock_status,
	query_all_sms,
	unlock
}
