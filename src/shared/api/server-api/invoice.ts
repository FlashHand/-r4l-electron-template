import { Goods } from '@/shared/model/goods'
import { Invoice } from '@/shared/model/invoice'
import ServerAPI from '../server'

class InvoiceAPI extends ServerAPI {
	// 上传发票信息
	public async save(form: InvoiceSaveForm): Promise<void> {
		return this.post('/dkInvoice/save', form)
	}

	// 查询发票状态
	public async queryStatus(form: QueryForm[]): Promise<State[]> {
		return this.post('/invoice/query', form)
	}

	public async incomeList(form: InvoiceIncomeQueryForm): Promise<ServerReponse.IncomeRecords> {
		return this.post('/dkInvoice/pageList', form)
	}

	public async outputList(form: InvoiceOutputQueryForm): Promise<ServerReponse.OutputRecords> {
		return this.post('/dkInvoice/xfpageList', form)
	}

	public async invoiceIncomeSumUp(form: ServerInvoiceSumUpForm): Promise<ServerReponse.SumUpData> {
		return this.post('/dkInvoice/sum', form)
	}
	public async invoiceOutputSumUp(form: ServerInvoiceSumUpForm): Promise<ServerReponse.SumUpData> {
		return this.post('/dkInvoice/xfsum', form)
	}
	// only insert records, never update records
	public async uploadApplyRecords(form: Array<FormDownloadRecord>): Promise<void> {
		return this.post('/downloadRecord/save', form)
	}

	public async applyRecords(khsh: string, recordState: Invoice.ApplyFileState): Promise<FormDownloadRecord[]> {
		return this.post('/downloadRecord/getDownloadList', { khsh, xzzt: recordState })
	}

	public async updateApplyRecordState(form: FormDownloadRecord): Promise<void> {
		return this.post('/downloadRecord/update', form)
	}

	public async uploadParsedDownloadRecord(form: FormParsedDownloadRecord): Promise<void> {
		return this.post('/dkInvoice/downloaddeal', form)
	}

	public async applyDownloadRecordList(form: { khsh: string, pageIndex: number, pageSize: number }): Promise<ServerDownloadRecordList> {
		return this.post('/downloadRecord/pageList', form)
	}

}
export interface ServerInvoiceSumUpForm {
	fplx: string;
	kprqJs: string,
	kprqKs: string,
	skssqJs: string,
	skssqKs: string,
	taxNumber: string
}

export interface ServerDownloadRecordList {
	current: number
	records: ServerDownloadRecord[]
	searchCount: boolean
	size: number
	total: number
}

export interface ServerDownloadRecord {
	createTime: string
	downloadRecordId: number
	fplx: Invoice.InvoiceType
	jxx: Invoice.SJLY
	khsh: string
	kprqJs: string
	kprqKs: string
	modifyTime: string
	sjclzt: Invoice.ApplyDownloadState
	sqrq: string
	xh: string
	xzlj: string
	xzzt: Invoice.ApplyFileState
}

export interface FormParsedDownloadRecord {
	gxyt?: number
	gxzt?: number
	ssq?: string
	khsh: string
	goodsList: Goods.DownloadRecord[]
	invoiceInfoList: Invoice.DownloadRecord[]

}
export interface FormDownloadRecord {
	// 1：增值税专用发票；
	// 2：增值税专用发票（电子）；
	// 3：机动车销售统一发票；
	// 4：道路通行费电子普通发票；
	// 5：增值税普通发票；
	// 6：增值税普通发票（电子）；
	// 7：增值税普通发票（卷票）；
	// 8：二手车销售统一发票；
	fplx: Invoice.InvoiceType,
	// 进销项 1 进项 2 销项
	jxx: Invoice.SJLY,
	khsh: string,
	kprqKs: string
	kprqJs: string
	sqrq: string
	// 0 处理中 1 处理完成
	sjclzt: Invoice.ApplyDownloadState
	// 下载状态；0-未知 1-无可下载数据；2-文件已过期 3-待下载；4-解析成功；5-解析失败；
	xzzt: Invoice.ApplyFileState
	// 下载链接
	xzlj: string
	lsh: string

}
export interface InvoiceQueryRecords {
	bz: string
	cd: string
	cllx: string
	clsbhclhm: string
}
export interface InvoiceIncomeQueryForm {
	kprqKs: string
	kprqJs: string
	skssqKs: string
	skssqJs: string
	taxNumber: string
	pageIndex: number
	pageSize: number
}

export interface InvoiceOutputQueryForm {
	fplx:string
	kprqJs: string
	kprqKs: string
	pageCount: number
	pageNo: number
	taxNumber: string
}

export interface State {
	errmsg: string // 上传失败信息
	flag: number // 上传状态 0- 发票未上传 1- 发票已上传但状态不一致 2- 发票已上传且状态一致 3- 发票上传失败
	fpdm: string // 发票代码
	fphm: string // 发票号码
	fplx: string // 发票类型
	fpzt: number // 发票状态 0- 正常发票， 1-负数发票， 2- 空白作废， 3- 蓝字作废， 4-红字作废
}

export interface InvoiceSaveForm {
	gxyt: number
	gxzt: number
	khsh: string
	ssq: string
	invoiceList: Invoice.Info[]
}

export interface QueryForm {
	fpdm: string
	fphm: string
	fplx: string
	fpzt: number
	jmc?: string
}

export const invoiceAPI = new InvoiceAPI()
