import {Goods} from '@/shared/model/goods'
import {Invoice} from '@/shared/model/invoice'
import {hex_md5} from '@/shared/tools/hex-md5'
import basenevt from '@/shared/tools/basenevt'
import WebAPI from '../web'
import storage from '@/shared/tools/storage'

export interface SSQResponse {
	key1: string // status
	key2: string
	key3: string // ssq
	key4: string // token
	key5: string // ssq;ssq-end;ssq like 202105;20210618;202105
	key6: string // totla interal 20170101-20210531
	key7: string
	key8: string
	key9: string
}

export default class TaxBureauAPI extends WebAPI {

	private cert: string

	constructor(baseURL: string, version: string, cert: string) {
		super(baseURL, version)
		this.cert = cert
	}

	private get token(): string {
		return storage.getToken() || ''
	}

	// 获取所属期信息
	public async ssq(token?: string): Promise<SSQResponse> {
		const res: any = await this.post(
			'/NSbsqWW/qrgycx.do',
			{
				id: 'qrgycx',
				cert: this.cert,
				rznf: '',
				ymbb: this.version,
				token: token || this.token
			}
		)
		return this.serializeJSON(res)
	}


	// 抵扣勾选
	// startDate 开票开始日期
	// endDate 开票结束日期
	// isGX 是否勾选 0 未勾选 1勾选
	// iDisplayStart 数据起始位置
	// iDisplayLength 返回数据量
	public async dkgx(
		startDate: string,
		endDate: string,
		isGX: number,
		iDisplayStart: number,
		iDisplayLength = 100
	): Promise<Invoice.Records> {
		const queryParams = [{'name': 'sEcho', 'value': 1}, {'name': 'iColumns', 'value': 15}, {
			'name': 'sColumns',
			'value': ',,,,,,,,,,,,,,'
		}, {'name': 'iDisplayStart', 'value': iDisplayStart}, {
			'name': 'iDisplayLength',
			'value': iDisplayLength
		}, {'name': 'mDataProp_0', 'value': 0}, {'name': 'mDataProp_1', 'value': 1}, {
			'name': 'mDataProp_2',
			'value': 2
		}, {'name': 'mDataProp_3', 'value': 3}, {'name': 'mDataProp_4', 'value': 4}, {
			'name': 'mDataProp_5',
			'value': 5
		}, {'name': 'mDataProp_6', 'value': 6}, {'name': 'mDataProp_7', 'value': 7}, {
			'name': 'mDataProp_8',
			'value': 8
		}, {'name': 'mDataProp_9', 'value': 9}, {'name': 'mDataProp_10', 'value': 10}, {
			'name': 'mDataProp_11',
			'value': 11
		}, {'name': 'mDataProp_12', 'value': 12}, {'name': 'mDataProp_13', 'value': 13}, {
			'name': 'mDataProp_14',
			'value': 14
		}]
		const rtm = String(Date.now())
		const res: any = await this.post(
			'/NSbsqWW/dkgx.do',
			{
				id: 'dkgxquery',
				fpdm: '',
				fphm: '',
				rq_q: startDate,
				rq_z: endDate,
				xfsbh: '',
				rzzt: isGX,
				glzt: -1,
				fpzt: -1,
				fplx: -1,
				cert: this.cert,
				sjly: -1,
				token: this.token,
				aoData: JSON.stringify(queryParams),
				rtm,
				ymbb: this.version
			},
		)
		const json = this.serializeJSON(res)
		return basenevt(json, rtm)
	}

	// 不抵扣勾选
	// startDate 开票开始日期
	// endDate 开票结束日期
	// isGX 是否勾选 0 未勾选 1勾选
	// iDisplayStart 数据起始位置
	// iDisplayLength 返回数据量
	public async bdkgx(
		startDate: string,
		endDate: string,
		isGX: number,
		iDisplayStart: number,
		iDisplayLength = 100
	): Promise<Invoice.Records> {
		const queryParams = [{'name': 'sEcho', 'value': 1}, {'name': 'iColumns', 'value': 14}, {
			'name': 'sColumns',
			'value': ',,,,,,,,,,,,,'
		}, {'name': 'iDisplayStart', 'value': iDisplayStart}, {
			'name': 'iDisplayLength',
			'value': iDisplayLength
		}, {'name': 'mDataProp_0', 'value': 0}, {'name': 'mDataProp_1', 'value': 1}, {
			'name': 'mDataProp_2',
			'value': 2
		}, {'name': 'mDataProp_3', 'value': 3}, {'name': 'mDataProp_4', 'value': 4}, {
			'name': 'mDataProp_5',
			'value': 5
		}, {'name': 'mDataProp_6', 'value': 6}, {'name': 'mDataProp_7', 'value': 7}, {
			'name': 'mDataProp_8',
			'value': 8
		}, {'name': 'mDataProp_9', 'value': 9}, {'name': 'mDataProp_10', 'value': 10}, {
			'name': 'mDataProp_11',
			'value': 11
		}, {'name': 'mDataProp_12', 'value': 12}, {'name': 'mDataProp_13', 'value': 13}]
		const rtm = String(Date.now())
		const res: any = await this.post(
			'/NSbsqWW/bdkgx.do',
			{
				method: 'fpquery',
				fpdm: '',
				fphm: '',
				rq_q: startDate,
				rq_z: endDate,
				xfsbh: '',
				rzzt: isGX,
				glzt: -1,
				fplx: -1,
				cert: this.cert,
				rtm,
				sjly: -1,
				token: this.token,
				aoData: JSON.stringify(queryParams),
				ymbb: this.version
			},
		)
		const json = this.serializeJSON(res)
		return basenevt(json, rtm)
	}

	// 查询发票
	// fpdm 发票代码
	// fphm 发票号码
	// kprq 开票日期
	// fplx 发票类型
	// 增值税专用发票 1
	// 增值税专用发票电子 7
	// 机动车销售统一发票 2
	// 增值税普通发票 3
	// 增值税普通发票电子 4
	// 增值税普通发票卷票 5
	// 道路通行费电子普通发票 8
	// 二手车销售统一发票 6
	// sjlx进销项 1 进项票 2 销项票
	public async queryInvoice(
		fpdm: string,
		fphm: string,
		kprq: string,
		fplx: number,
		sjlx: number
	): Promise<Invoice.Detail> {
		const res: any = await this.post(
			'/NFpxzWW/fpcx.do',
			{
				id: 'cxpmxx',
				fpdm,
				fphm,
				kprq,
				sjlx,
				fplx,
				cert: this.cert,
				token: this.token,
				ymbb: this.version
			},
		)
		const json = this.serializeJSON(res)
		return json
	}

	// 查询货物
	// fpdm 发票代码
	// fphm 发票号码
	// kprq 开票日期
	// fplx 发票类型
	// sjly 数据来源
	// iDisplayStart 数据起始位置
	// iDisplayLength 返回数据量
	public async queryGoodsRecords(
		fpdm: string,
		fphm: string,
		kprq: string,
		fplx: number,
		sjly: number,
		iDisplayStart: number,
		iDisplayLength = 100
	): Promise<Goods.Records> {
		const queryParams = [{'name': 'sEcho', 'value': 1}, {'name': 'iColumns', 'value': 10}, {
			'name': 'sColumns',
			'value': ',,,,,,,,,'
		}, {'name': 'iDisplayStart', 'value': iDisplayStart}, {
			'name': 'iDisplayLength',
			'value': iDisplayLength
		}, {'name': 'mDataProp_0', 'value': 0}, {'name': 'mDataProp_1', 'value': 1}, {
			'name': 'mDataProp_2',
			'value': 2
		}, {'name': 'mDataProp_3', 'value': 3}, {'name': 'mDataProp_4', 'value': 4}, {
			'name': 'mDataProp_5',
			'value': 5
		}, {'name': 'mDataProp_6', 'value': 6}, {'name': 'mDataProp_7', 'value': 7}, {
			'name': 'mDataProp_8',
			'value': 8
		}, {'name': 'mDataProp_9', 'value': 9}]
		const res: any = await this.post(
			'/NFpxzWW/fpcx.do',
			{
				id: 'cxhwxx',
				cert: this.cert,
				token: this.token,
				fplx,
				fpdm,
				fphm,
				kprq,
				sjly,
				aoData: JSON.stringify(queryParams),
				ymbb: this.version
			},
		)
		const json = this.serializeJSON(res)
		return json
	}

	public async queryHistory(ssq: string) {
		const res: any = await this.post(
			'/NSbsqWW/dktj.do',
			{
				id: 'wqdktj',
				cert: this.cert,
				token: this.token,
				tjyf: ssq,
				ymbb: this.version,
				qt: 'wq'
			},
		)
		const json = this.serializeJSON(res)
		return json
	}

	// 抵扣统计勾选
	// ssq 所属期
	// fply 0 全部 1 抵扣 2 不抵扣
	// iDisplayStart 数据起始位置
	// iDisplayLength 返回数据量
	public async queryHistoryRecords(
		ssq: string,
		fply: number,
		iDisplayStart: number,
		iDisplayLength = 100,
		fpdm = '',
		fphm = '',
		startDate = '',
		endDate = ''
	): Promise<Invoice.HistoryRecords> {
		const queryParams = [{'name': 'sEcho', 'value': 1}, {'name': 'iColumns', 'value': 15}, {
			'name': 'sColumns',
			'value': ',,,,,,,,,,,,,,'
		}, {'name': 'iDisplayStart', 'value': iDisplayStart}, {
			'name': 'iDisplayLength',
			'value': iDisplayLength || 100
		}, {'name': 'mDataProp_0', 'value': 0}, {'name': 'mDataProp_1', 'value': 1}, {
			'name': 'mDataProp_2',
			'value': 2
		}, {'name': 'mDataProp_3', 'value': 3}, {'name': 'mDataProp_4', 'value': 4}, {
			'name': 'mDataProp_5',
			'value': 5
		}, {'name': 'mDataProp_6', 'value': 6}, {'name': 'mDataProp_7', 'value': 7}, {
			'name': 'mDataProp_8',
			'value': 8
		}, {'name': 'mDataProp_9', 'value': 9}, {'name': 'mDataProp_10', 'value': 10}, {
			'name': 'mDataProp_11',
			'value': 11
		}, {'name': 'mDataProp_12', 'value': 12}, {'name': 'mDataProp_13', 'value': 13}, {
			'name': 'mDataProp_14',
			'value': 14
		}]
		const res: any = await this.post(
			'/NSbsqWW/dktj.do',
			{
				id: 'dkmx',
				cert: this.cert,
				token: this.token,
				tjyf: ssq,
				fpdm,
				fphm,
				xfsbh: '',
				qrrzrq_q: startDate,
				qrrzrq_z: endDate,
				fply,
				aoData: JSON.stringify(queryParams),
				ymbb: this.version,
				qt: 'wq',
			},
		)
		const json = this.serializeJSON(res)
		return json
	}

	// 申请发票下载
	// fplxs 发票类型 申请多个发票类型时以逗号分隔 01,08,03
	// 01 增值税专用发票
	// 08 增值税专用发票电子
	// 03 机动车销售统一发票
	// 04 增值税普通发票
	// 10 增值税普通发票电子
	// 11 增值税普通发票卷票
	// 15 二手车销售统一发票
	// 14 道路通行费电子普通发票
	// sjlxs 进销项 1 进项 2 销项 申请多个时以逗号分隔 1,2
	// kprqq 起始开票日期 YYYY-MM-DD
	// kprqz 终止开票日期 YYYY-MM-DD
	// jymm 解压密码 不低于6位
	public async invoiceApplyDownload(fplxs: string, sjlxs: string, kprqq: string, kprqz: string, jymm: string): Promise<Invoice.Response> {
		const timestamp = Date.now() + 'a'
		const r = fplxs + sjlxs + kprqq + kprqz + encodeURIComponent(jymm) + timestamp
		const sign = hex_md5(encodeURIComponent(r))
		const res: any = await this.post(
			'/NFpxzWW/fpxz.do',
			{
				id: 'qqxz',
				cert: this.cert,
				token: this.token,
				ymbb: this.version,
				fplxs,
				sjlxs,
				kprqq,
				kprqz,
				jymm,
				sign,
				timestamp
			}
		)
		const json = this.serializeJSON(res)
		return json
	}

	// 发票下载申请列表
	// sqrqq 申请开始日期
	// sqrqz 申请结束日期
	// sjlx 进销项 0 全部
	// fplx 发票类型
	// 0 全部
	// 01 增值税专用发票
	// 08 增值税专用发票电子
	// 03 机动车销售统一发票
	// 04 增值税普通发票
	// 10 增值税普通发票电子
	// 11 增值税普通发票卷票
	// 15 二手车销售统一发票
	// 14 道路通行费电子普通发票
	// iDisplayStart 数据起始位置
	// iDisplayLength 返回数据量
	public async queryApplyRecords(
		sqrqq: string,
		sqrqz: string,
		sjlx: number,
		fplx: string,
		iDisplayStart: number,
		iDisplayLength = 100
	): Promise<Invoice.ApplyDownloadRecords> {
		const queryParams = [{'name': 'sEcho', 'value': 1}, {'name': 'iColumns', 'value': 8}, {
			'name': 'sColumns',
			'value': ',,,,,,,'
		}, {'name': 'iDisplayStart', 'value': iDisplayStart}, {
			'name': 'iDisplayLength',
			'value': iDisplayLength
		}, {'name': 'mDataProp_0', 'value': 0}, {'name': 'mDataProp_1', 'value': 1}, {
			'name': 'mDataProp_2',
			'value': 2
		}, {'name': 'mDataProp_3', 'value': 3}, {'name': 'mDataProp_4', 'value': 4}, {
			'name': 'mDataProp_5',
			'value': 5
		}, {'name': 'mDataProp_6', 'value': 6}, {'name': 'mDataProp_7', 'value': 7}, {
			'name': 'mDataProp_8',
			'value': 8
		}, {'name': 'mDataProp_9', 'value': 9}]
		const res: any = await this.post(
			'/NFpxzWW/fpxz.do',
			{
				id: 'cxqq',
				cert: this.cert,
				token: this.token,
				fplx,
				sjlx,
				sqrqq,
				sqrqz,
				clzt: '-1',
				aoData: JSON.stringify(queryParams),
				ymbb: this.version
			},
		)
		const json = this.serializeJSON(res)
		return json
	}

	// 发票是否允许下载
	// wjm 文件名(文件路径)
	// filename 文件名
	public async invoiceDownloadApproved(wjm: string, filename: string, lsh: string) {
		const res: any = await this.post(
			'/NFpxzWW/fpxz.do',
			{
				id: 'showyzm',
				cert: this.cert,
				token: this.token,
				ymbb: this.version,
				wjm,
				filename,
				lsh
			}
		)
		const json = this.serializeJSON(res)
		return json
	}

	// 下载发票Excel
	// wjm 文件名(文件路径)
	// filename 文件名
	public async downloadExcel(wjm: string, filename: string, lsh: string): Promise<Buffer> {
		return this.download(
			`/NFpxzWW/fpxz.do?id=xzexcel&cert=${this.cert}&token=${this.token}&ymbb=${this.version}&lsh=${lsh}`,
			{
				wjm,
				filename,
				yzmkey: '',
				yzmvalue: ''
			}
		)
	}

}
