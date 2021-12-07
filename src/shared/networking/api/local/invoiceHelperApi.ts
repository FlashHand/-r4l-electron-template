import {BasicClient} from 'r-networking';
import errHandler from '@/shared/networking/mws/local/invoiceHelper/errHandler';

const bc = new BasicClient({
	// baseURL: 'http://192.168.154.118:8000'
	// baseURL: 'http://192.168.153.121:8000'
	baseURL:'http://127.0.0.1:12899'
}, [], [errHandler]);
const hello = () => bc.createGet('/heartbeat');
const getAllCom = () => bc.createGet('/users');
const add_invoice_software = (params: any) => bc.createPostJSON('/add_invoice_software', params);
const set_user_enable_status = (params: any) => bc.createPostJSON('/set_user_enable_status', params);
const invoice_softwares = () => bc.createGet('/invoice_softwares');

export default {
	hello,
	getAllCom,
	add_invoice_software,
	set_user_enable_status,
	invoice_softwares
}
