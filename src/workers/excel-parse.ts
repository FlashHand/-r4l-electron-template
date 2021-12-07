import xlsx from 'xlsx'
import { Open } from 'unzipper'
import DownloadInvoice from '@/renderers/invoice/stores/Pull/models/DownloadInvoice';
import DownloadItem from '@/renderers/invoice/stores/Pull/models/DownloadItem';
import InvoiceType from '@/renderers/invoice/stores/enums/InvoiceType';
import {timer} from 'r-foundation';
const ctx: Worker = self as any
ctx.onmessage = async (event) => {
	const {buf, rysFplx, jymm} = event.data
	await parseData(buf, rysFplx, jymm)
};
// ctx.onm('message', async (event) => {
// 	const { buf, fplx, jymm } = event.data
// 	await parseData(buf, fplx, jymm)
// })

/**
 *
 * @param {Buffer} buf
 * @param rysFplx
 * @param {string} jymm 解压密码
 * @returns {Promise<void>}
 */
async function parseData(buf: Buffer, rysFplx: InvoiceType, jymm: string): Promise<void> {
	try {
		//读取压缩包
		let invoiceArr: DownloadInvoice[] = [];
		let itemArr: DownloadItem[] = [];

		const dir = await Open.buffer(buf);
		for (const file of dir.files) {
			//用密码解压文件
			const extract = await file.buffer(jymm);
			const webbook = xlsx.read(extract)
			for (const name of webbook.SheetNames) {
				try {
					const sheet = webbook.Sheets[name]
					const data: string[][] = xlsx.utils.sheet_to_json(sheet, {header: 1, defval: ''});
					data.splice(0, 2)
					const filtered = data.filter(row => {
						try {
							return row[0]
						} catch (e) {
							return false;
						}
					});
					console.log('线程已解析',rysFplx,filtered);
					if (name.indexOf('发票信息') >= 0) {
						invoiceArr = invoiceArr.concat(filtered.map((v: any) => new DownloadInvoice(v, rysFplx)));
					}
					if (name.indexOf('货物信息') >= 0) {
						itemArr = itemArr.concat(filtered.map((v: any) => new DownloadItem(v, rysFplx)));
					}
				} catch (e) {
					throw new Error(`解析excel失败:${e.message}`);
				}
			}
		}
		ctx.postMessage({
			payload: {
				invoiceArr,
				itemArr
			}
		})
		return
	} catch (e) {
		ctx.postMessage({
			err: e,
		})
	}

}
