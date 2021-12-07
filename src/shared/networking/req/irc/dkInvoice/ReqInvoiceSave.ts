import InvoiceRecord from '@/renderers/invoice/stores/Pull/models/InvoiceRecord';
import InvoiceDetail from '@/renderers/invoice/stores/Pull/models/InvoiceDetail';
import InvoiceItem from '@/renderers/invoice/stores/Pull/models/InvoiceItem';
import {Invoice} from '@/shared/model/invoice';
import loginState from '@/renderers/invoice/stores/Login/loginState';
import pullState from '@/renderers/invoice/stores/Pull/pullState';

class ReqInvoiceSave {
	record: InvoiceRecord;
	detail: InvoiceDetail;
	items: InvoiceItem[];

	constructor(record: InvoiceRecord, detail: InvoiceDetail, items: InvoiceItem[]) {
		this.record = record;
		this.detail = detail;
		this.items = items;
	}

	/**
	 * 生成请求参数
	 * @param uploadArr
	 * @param {0 | 1} gxyt 勾选用途0:不抵扣，1：抵扣
	 * @returns {{khsh: string, ssq: string, invoiceList: {invoiceInfo: {key1: string, key2: string, setDkWgx(data: any): void, cjhm: string, key5: number, dh: string, ghdw: string, gfmc: string, key3: string, key4: string, yxse?: string, getFplxForQueryDetail(): (number), dw: string, dz: string, checked?: string, xfdzdh: string, skr: string, cllx: string, clsbhclhm: string, khyh: string, kpr: string, zh: string, cpxh: string, nsrsbh: string, fpzt: number, zzsse: string, xxly?: string, gxsj: string, jshj: number, zgswjgdm: string, je: number | string, setBdkWgx(data: any): void, xfmc: string, slv: string, fdjhm: string, gfsh: string, gfyhzh: string, hgzs: string, mmq: string, se: number | string, khyhzh: string, cjfy: string, xcrs: string, kprq: string, bz: string, gxzt: number, hgzh: string, zzjgdm: string, zgswjg: string, cd: string, gfsbh: string, op?: string, fpdm: string, wz?: string, swjg_dm: string, fplx: number, glzt: number, xfyhzh: string, xh?: string, fhr: string, gfdzdh: string, swjg_mc: string, xhdwmc: string, xfsh: string, gxyt?: string, fphm: string, jym: string}, goodsList: InvoiceItem[]}, gxzt: any, gxyt: 0 | 1}}
	 */
	static buildWGXParams(uploadArr:ReqInvoiceSave[], gxyt:0|1) {

		return {
			khsh: loginState.certInfo,
			ssq: pullState.ssq.format('YYYY-MM-DD'),
			gxyt,
			gxzt:0,
			invoiceList: uploadArr.map((req => {
				const detail = req.detail;
				const record = req.record;

				return {
					goodsList: req.items,
					invoiceInfo: {
						...detail,
						...record,
						...{
							cd: detail.cd || '',
							cllx: detail.cllx || '',
							clsbhclhm: detail.cjhm || '',
							cpxh: detail.cpxh || '',
							fhr: detail.fhr || '',
							skr: detail.skr || '',
							kpr: detail.kpr || '',
							gfmc: detail.gfmc || detail.ghdw || '',
							dh: detail.dh || '',
							dw: detail.dw || '',
							dz: detail.dz || '',
							fdjhm: detail.fdjhm || '',
							hgzh: detail.hgzs || '',
							xfmc: detail.xfmc || detail.xhdwmc || '',
							gfsh: detail.gfsh || detail.gfsbh || '',
							gfdzdh: detail.gfdzdh || '',
							gfyhzh: detail.gfyhzh || '',
							jshj: detail.jshj || 0,
							xfdzdh: detail.xfdzdh || '',
							xfsh: detail.xfsh || detail.nsrsbh || '',
							khyh: detail.khyhzh || '',
							se: detail.se || detail.zzsse || '',
							je: detail.je || detail.cjfy || '',
							zgswjgdm: detail.swjg_mc || '',
							zgswjg: detail.swjg_dm || '',
							slv: detail.slv || '',
							zh: detail.zh || '',
							xfyhzh: detail.xfdzdh || '',
							jym: detail.jym || '',
							xcrs: detail.xcrs || '',
						}
					}
				}
			}))
		}
	}

	/**
	 *
	 * @param ssq
	 * @param {ReqInvoiceSave[]} uploadArr
	 * @param {0 | 1} gxyt 0:不抵扣，1：抵扣
	 * @returns {{khsh: string, ssq: string, invoiceList: {invoiceInfo: {key1: string, key2: string, setDkWgx(data: any): void, cjhm: string, key5: number, dh: string, ghdw: string, gfmc: string, key3: string, key4: string, yxse?: string, getFplxForQueryDetail(): (number), dw: string, setDkGx(data: any): void, dz: string, checked?: string, xfdzdh: string, skr: string, cllx: string, clsbhclhm: string, khyh: string, setBDkGx(data: any): void, kpr: string, zh: string, cpxh: string, nsrsbh: string, fpzt: number, zzsse: string, xxly?: string, gxsj: string, jshj: number, zgswjgdm: string, je: number | string, setBdkWgx(data: any): void, xfmc: string, slv: string, fdjhm: string, gfsh: string, gfyhzh: string, hgzs: string, mmq: string, se: number | string, khyhzh: string, cjfy: string, xcrs: string, kprq: string, bz: string, gxzt: number, hgzh: string, zzjgdm: string, zgswjg: string, cd: string, gfsbh: string, op?: string, fpdm: string, wz?: string, swjg_dm: string, fplx: number, glzt: number, xfyhzh: string, xh?: string, fhr: string, gfdzdh: string, swjg_mc: string, xhdwmc: string, xfsh: string, gxyt?: string, fphm: string, jym: string}, goodsList: InvoiceItem[]}[], gxzt: number, gxyt: 0 | 1}}
	 */
	static buildGXParams(ssq:string,uploadArr:ReqInvoiceSave[], gxyt:0|1) {

		return {
			khsh: loginState.certInfo,
			ssq,
			gxyt,
			gxzt:1,
			invoiceList: uploadArr.map((req => {
				const detail = req.detail;
				const record = req.record;
				return {
					goodsList: req.items,
					invoiceInfo: {
						...detail,
						...record,
						...{
							cd: detail.cd || '',
							cllx: detail.cllx || '',
							clsbhclhm: detail.cjhm || '',
							cpxh: detail.cpxh || '',
							fhr: detail.fhr || '',
							skr: detail.skr || '',
							kpr: detail.kpr || '',
							gfmc: detail.gfmc || detail.ghdw || '',
							dh: detail.dh || '',
							dw: detail.dw || '',
							dz: detail.dz || '',
							fdjhm: detail.fdjhm || '',
							hgzh: detail.hgzs || '',
							xfmc: detail.xfmc || detail.xhdwmc || '',
							gfsh: detail.gfsh || detail.gfsbh || '',
							gfdzdh: detail.gfdzdh || '',
							gfyhzh: detail.gfyhzh || '',
							jshj: detail.jshj || 0,
							xfdzdh: detail.xfdzdh || '',
							xfsh: detail.xfsh || detail.nsrsbh || '',
							khyh: detail.khyhzh || '',
							se: detail.se || detail.zzsse || '',
							je: detail.je || detail.cjfy || '',
							zgswjgdm: detail.swjg_mc || '',
							zgswjg: detail.swjg_dm || '',
							slv: detail.slv || '',
							zh: detail.zh || '',
							xfyhzh: detail.xfdzdh || '',
							jym: detail.jym || '',
							xcrs: detail.xcrs || '',
						}
					}
				}
			}))
		}
	}

}

export default ReqInvoiceSave;
