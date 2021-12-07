import { Invoice } from './invoice'

export namespace Goods {
	export interface Records {
		key1: string
		key2: string // token
		key3: {
			aaData: any[],
			iTotalRecords: number,
			iTotalDisplayRecords: number
			sEcho: number
		}
		key4: number
	}

	export class Record {
		public xh: number // 序号
		public hwhyslwmc: string // 货物或应税劳务名称
		public ssflbm: string // 税收分类编码
		public ggxh: string // 规格型号
		public dw: string // 单位
		public sl: string // 数量
		public dj: string // 单价
		public je: number // 金额
		public slv: number // 税率
		public se: number // 税额

		constructor(data: any[]) {
			this.xh = data[0]
			this.hwhyslwmc = data[1]
			this.ssflbm = data[2] || ''
			this.ggxh = data[3] || ''
			this.dw = data[4] || ''
			this.sl = data[5] || ''
			this.dj = data[6] || ''
			this.je = data[7]
			this.slv = data[8] || ''
			this.se = data[9]
		}
	}

	export class DownloadRecord {
		public xh: number // 序号
		public fpdm: string //发票代码
		public fphm: string // 发票号码
		public hwhyslwmc = '' // 货物或应税劳务名称
		public ssflbm = '' // 税收分类编码
		public xm = '' // 项目
		public ggxh = '' // 规格型号
		public dw = '' // 单位
		public sl: string // 数量
		public dj: string // 单价
		public je = 0 // 金额
		public slv = 0 // 税率
		public se = 0  // 税额

		constructor(data: any[], invoiceType: Invoice.InvoiceType) {
			if (invoiceType == Invoice.InvoiceType.vatNormalVolume) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.ssflbm = data[3]
				this.hwhyslwmc = data[4]
				this.dj = data[5]
				this.sl = data[6]
				this.je = data[7]
			} else if (
				invoiceType == Invoice.InvoiceType.motorVehicleSales ||
				invoiceType == Invoice.InvoiceType.vatNormal ||
				invoiceType == Invoice.InvoiceType.vatNormaltElectronic ||
				invoiceType == Invoice.InvoiceType.roadToll ||
				invoiceType == Invoice.InvoiceType.vatSpecial) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.ssflbm = data[3]
				this.hwhyslwmc = data[4]
				this.ggxh = data[5]
				this.dw = data[6]
				this.sl = data[7]
				this.dj = data[8]
				this.je = data[9]
				this.slv = data[10]
				this.se = data[11]
			} else {
				throw `unknown Goods download record ${data}`
			}

		}
	}
}
