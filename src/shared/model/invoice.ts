import moment from 'moment'
import { Goods } from './goods'

export namespace Invoice {

	export interface Response {
		key1: string | number // 200 ok
		key2: string
	}

	export class Record {
		public xh?: string // 序号
		public checked?: string // 0=0=0
		public fpdm: string // 发票代码
		public fphm: string // 发票号码
		public kprq: string // 开票日期 2021-03-16
		public xfmc: string // 销方名称
		public je: string // 金额
		public se: string // 税额
		public yxse?: string // 有效税额
		public fpzt: number // 发票状态 0 正常 2 已作作废 3 已红冲
		public fplx: number
		public gxyt?: string // 勾选用途
		public xxly?: string // 信息来源
		public gxzt: number // 是否勾选 0 否 1 是
		public gxsj: string // 勾选时间
		public glzt: number // 管理状态 0 正常
		public op?: string   // 操作  查看明细信息
		public wz?: string   // 未知加密信息

		// with records data
		constructor(data: any[]) {
			if (data.length === 16) {
				this.checked = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.xfmc = data[4]
				this.je = data[5]
				this.se = data[6]
				this.yxse = data[7].split('=')[1]
				this.fpzt = parseInt(data[8], 10)
				this.fplx = parseInt(data[9], 10)
				this.xxly = data[10]
				this.gxzt = parseInt(data[11], 10)
				const date = Date.parse(data[12])
				if (date) {
					this.gxsj = data[12]
				} else {
					this.gxsj = ''
				}
				this.glzt = data[13]
				this.op = data[14]
				this.wz = data[15]
			} else if (data.length === 14) {
				this.checked = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.xfmc = data[4]
				this.je = data[5]
				this.se = data[6]
				this.fpzt = parseInt(data[7], 10)
				this.fplx = parseInt(data[8], 10)
				this.xxly = data[9]
				this.gxzt = parseInt(data[10], 10)
				const date = Date.parse(data[11])
				if (date) {
					this.gxsj = data[11]
				} else {
					this.gxsj = ''
				}
				this.glzt = data[12]
				this.op = data[13]
			} else if (data.length === 17) {
				this.checked = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.xfmc = data[4]
				this.je = data[5]
				this.se = data[6]
				this.yxse = data[7].split('=')[1]
				this.fpzt = parseInt(data[8], 10)
				this.fplx = parseInt(data[9], 10)
				this.xxly = data[10]
				this.gxzt = parseInt(data[11], 10)
				const date = Date.parse(data[12])
				if (date) {
					this.gxsj = data[12]
				} else {
					this.gxsj = ''
				}
				this.glzt = data[13]
				this.op = data[14]
			} else if (data.length === 15) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.xfmc = data[4]
				this.je = data[5]
				this.se = data[6]
				this.yxse = data[7]
				this.gxsj = moment(data[8]).format('YYYY-MM-DD HH:mm:ss')
				if (data[9] === '增值税专票') {
					this.fplx = 1
				} else if (data[9] === '通行费电子发票') {
					this.fplx = 14
				} else if (data[9] === '机动车发票') {
					this.fplx = 3
				} else {
					throw new Error(`unknown fplx: ${data[9]}`)
				}
				this.gxyt = data[10] === '抵扣' ? '1' : '0'
				this.gxzt = 1
				if (data[11] === '正常') {
					this.fpzt = 0
				} else if (data[11] === '已作废') {
					this.fpzt = 2
				} else if (data[11] === '已红冲') {
					this.fpzt = 3
				} else {
					throw new Error(`unknown fpzt: ${data[11]}`)
				}
				if (data[12] === '正常') {
					this.glzt = 0
				} else {
					throw new Error(`unknown glzt: ${data[12]}`)
				}
				this.xxly = data[13]
				this.op = data[14]
			} else {
				throw new Error(`unknown invoic record: ${data}`)
			}
		}
	}

	export interface Records extends Response {
		key3: {
			aaData: any[]
			iTotalRecords: number
			iTotalDisplayRecords: number
			sEcho: number
		}
		key4: number
	}

	export interface HistoryRecords extends Records { }

	export interface Detail {
		bz: string // 备注
		fhr: string // 复核人
		fpdm: string // 发票代码
		fphm: string // 发票号码
		fpzt: string // 发票状态
		gfdzdh: string // 购方地址电话
		gfmc: string // 购方名称
		gfsh: string // 购方税号
		gfyhzh: string // 购方开户行及账号
		je: number // 金额
		jshj: number // 价税合计
		jym: string // 校验码
		key1: string
		key2: string // token
		key3: string
		key4: string
		key5: number // sjly
		kpr: string // 开票人
		kprq: string // 开票日期
		mmq: string
		se: number // 税额
		skr: string // 收款人
		xfdzdh: string // 销方地址电话
		xfmc: string // 销方名称
		xfsh: string // 销方税号
		xfyhzh: string // 销方开户行及账号
		cd: string
		cjfy: string
		cjhm: string
		cllx: string
		cpxh: string
		dh: string
		dw: string
		dz: string
		fdjhm: string
		gfsbh: string
		ghdw: string
		hgzs: string
		khyhzh: string
		nsrsbh: string
		slv: string
		swjg_dm: string
		swjg_mc: string
		xcrs: string
		xhdwmc: string
		zh: string
		zzjgdm: string
		zzsse: string
	}

	export interface Info {
		invoiceInfo: any
		goodsList?: Goods.Record[]
	}
	export interface HistoryStatistics extends Response {
		key3: string
		key4: string
		key5: string
		key6: string
	}

	export class DownloadRecord {
		public xh: string // 序号
		public fpdm: string // 发票代码
		public fphm: string // 发票号码
		public fplx: InvoiceType // 发票类型
		public kprq: string // 开票日期 2021-03-16
		public fpzt: InvoiceState // 发票状态 0 正常 2 作废 3 红冲
		public ssflbm = '' // 税收分类编码
		public sfzhzzhm = '' // 身份证号码/组织机构代码
		public cllx = '' // 车辆类型
		public cpxh = '' // 厂牌型号
		public hgzh = '' // 合格证号
		public cd = '' // 产地
		public jkzmsh = '' // 进口证明书号
		public sjdh = '' // 商检单号
		public fdjhm = '' // 发动机号码
		public clsbhclhm = '' // 车辆识别代号/车架号码
		public dh = '' // 电话
		public zh = '' // 账号
		public dz = '' // 地址
		public khyh = '' // 开户银行
		public slv = '0' // 增值税税率或征收率
		public zgswjg = '' // 主管税务机关
		public zgswjgdm = '' // 主管税务机关代码
		public wspzhm = '' // 完税凭证号码
		public dw = 0 // 吨位
		public xcrs = 0 // 限乘人数
		public jqbm = '' // 机器编号
		public jdhm = '' // 机打号码
		public xfmc = '' // 销方名称
		public xfsh = '' // 销方税号
		public gfsh = '' // 购方税号
		public gfmc = '' // 购方名称
		public je = 0 // 金额
		public se = 0 // 税额
		public jshj = 0 // 价税合计
		public jym = ''// 校验码
		public xfdzdh = '' // 销方地址电话
		public xfyhzh = '' // 销方开户行及账号
		public gfdzdh = '' // 购方地址电话
		public gfyhzh = '' // 购方开户行及账号
		public mmq = '' // 密码区
		public bz = '' // 备注
		public kpr = '' // 开票人
		public skr = '' // 收款人
		public fhr = '' //复核人
		public glzt = 0 // 管理状态
		constructor(data: any[], invoiceType: InvoiceType) {
			this.fplx = invoiceType
			if (invoiceType == InvoiceType.vatNormal) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.fpzt = this.exchangeState(data[4])
				this.xfsh = data[5]
				this.xfmc = data[6]
				this.gfsh = data[7]
				this.gfmc = data[8]
				this.je = parseFloat(data[9])
				this.se = parseFloat(data[10])
				this.jshj = parseFloat(data[11])
				this.jym = data[12]
				this.xfdzdh = data[13]
				this.xfyhzh = data[14]
				this.gfdzdh = data[15]
				this.gfyhzh = data[16]
				this.mmq = data[17]
				this.bz = data[18]
				this.kpr = data[19]
				this.skr = data[20]
				this.fhr = data[21]
			}
			else if (invoiceType == InvoiceType.motorVehicleSales) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.fpzt = this.exchangeState(data[4])
				this.gfmc = data[5]
				this.sfzhzzhm = data[6]
				this.gfsh = data[7]
				this.cllx = data[8]
				this.cpxh = data[9]
				this.cd = data[10]
				this.hgzh = data[11]
				this.jkzmsh = data[12]
				this.sjdh = data[13]
				this.fdjhm = data[14]
				this.clsbhclhm = data[15]
				this.jshj = parseFloat(data[16])
				this.xfmc = data[17]
				this.dh = data[18]
				this.xfsh = data[19]
				this.zh = data[20]
				this.dz = data[21]
				this.khyh = data[22]
				this.slv = data[23]
				this.se = parseFloat(data[24])
				this.zgswjg = data[25]
				this.zgswjgdm = data[26]
				this.je = parseFloat(data[27])
				this.wspzhm = data[28]
				this.dw = parseFloat(data[29])
				this.xcrs = parseInt(data[30])
			}
			else if (invoiceType == InvoiceType.vatNormaltElectronic) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.fpzt = this.exchangeState(data[4])
				this.xfsh = data[5]
				this.xfmc = data[6]
				this.gfsh = data[7]
				this.gfmc = data[8]
				this.je = parseFloat(data[9])
				this.se = parseFloat(data[10])
				this.jshj = parseFloat(data[11])
				this.jym = data[12]
				this.xfdzdh = data[13]
				this.xfyhzh = data[14]
				this.gfdzdh = data[15]
				this.gfyhzh = data[16]
				this.mmq = data[17]
				this.jqbm = data[18]
				this.kpr = data[19]
				this.skr = data[20]
				this.fhr = data[21]
			}
			else if (invoiceType == InvoiceType.vatNormalVolume) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.fpzt = this.exchangeState(data[4])
				this.xfmc = data[5]
				this.xfsh = data[6]
				this.gfmc = data[7]
				this.gfsh = data[8]
				this.jdhm = data[9]
				this.jqbm = data[10]
				this.skr = data[11]
				this.jym = data[12]
			}
			else if (invoiceType == InvoiceType.roadToll) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.fpzt = this.exchangeState(data[4])
				this.xfsh = data[5]
				this.xfmc = data[6]
				this.gfsh = data[7]
				this.gfmc = data[8]
				this.je = parseFloat(data[9])
				this.se = parseFloat(data[10])
				this.jshj = parseFloat(data[11])
				this.jym = data[12]
				this.xfdzdh = data[13]
				this.xfyhzh = data[14]
				this.gfdzdh = data[15]
				this.gfyhzh = data[16]
				this.mmq = data[17]
				this.bz = data[18]
				this.jqbm = data[19]
				this.kpr = data[20]
				this.skr = data[21]
				this.fhr = data[22]
			}
			else if (invoiceType == InvoiceType.vatSpecial) {
				this.xh = data[0]
				this.fpdm = data[1]
				this.fphm = data[2]
				this.kprq = data[3]
				this.fpzt = this.exchangeState(data[4])
				this.xfsh = data[5]
				this.xfmc = data[6]
				this.gfsh = data[7]
				this.gfmc = data[8]
				this.je = parseFloat(data[9])
				this.se = parseFloat(data[10])
				this.jshj = parseFloat(data[11])
				this.jym = data[12]
				this.xfdzdh = data[13]
				this.xfyhzh = data[14]
				this.gfdzdh = data[15]
				this.gfyhzh = data[16]
				this.mmq = data[17]
				this.bz = data[18]
				this.kpr = data[19]
				this.skr = data[20]
				this.fhr = data[21]
			} else {
				throw new Error(`unknown download record: ${invoiceType} ${data}`)
			}
		}

		private exchangeState(fpzt: string) {
			switch (fpzt) {
				case '正常':
					return InvoiceState.ok
				case '作废':
					return InvoiceState.abandoned
				case '红冲':
					return InvoiceState.red
				default:
					throw new Error(`unknown fpzt: ${fpzt}`)
			}
		}
	}

	export interface ApprovedDownload extends Response {
		origin: string
		cert: string
		token: string
		ymbb: string
		wjm: string
		filename: string
	}

	// 申请下载记录列表
	export interface ApplyDownloadRecords extends Response {
		key3: {
			aaData: string[][]
			iTotalRecords: number
			iTotalDisplayRecords: number
			sEcho: number
		}
		key4: string
	}

	export enum ApplyDownloadState {
		waiting = 1,
		completed = 2
	}

	export enum ApplyFileState {
		unkonwn = 0,
		notAvailable = 1,
		expired = 2,
		available = 3,
		parsedSucess = 4,
		parsedFailed = 5
	}

	export enum SJLY {
		j = 1, // 进项
		x = 2 // 销项
	}

	export enum InvoiceType {
		vatSpecial = '1', //增值税专用发票
		vatSpecialElectronic = '2', //增值税专用发票（电子）
		motorVehicleSales = '3', //机动车销售统一发票
		roadToll = '4', // 道路通行费电子普通发票
		vatNormal = '5', //增值税普通发票
		vatNormaltElectronic = '6', // 增值税普通发票（电子）
		vatNormalVolume = '7', // 增值税普通发票（卷票）
		usedCars = '8', // 二手车销售统一发票
		customsPayment = '9' //海关缴款书

	}


	export enum InvoiceState {
		ok = 0, // 正常
		abandoned = 2, // 作废
		red = 3, // 冲红
	}

	// 申请下载记录
	export class ApplyDownloadRecord {

		public readonly xh: string // 序号
		public readonly sqsj: string // 申请时间
		// 发票类型
		// 1 增值税专用发票
		// 2 机动车销售统一发票
		// 3 增值税普通发票
		// 4 增值税普通发票（电子）
		// 5 增值税普通发票（卷票）
		// 6 二手车销售统一发票
		// 7 增值税专用发票（电子）
		// 8 道路通行费电子普通发票
		// 9 海关缴款书
		public readonly fplx: InvoiceType
		public readonly kprqq: string // 起始开票日期
		public readonly kprqz: string // 终止开票日期
		public readonly sjly: SJLY // 进销项
		// 处理状态
		// 处理完成
		// 待处理
		public readonly state: ApplyDownloadState
		// 下载链接
		// HTMLAnchorElement
		// 不存在符合条件的发票
		// 文件已过期
		public readonly downloadHtml?: string // 下载链接
		public readonly filePath?: string // 下载路径
		public readonly fileName?: string // 文件名
		public readonly lsh: string

		public fileState: ApplyFileState = ApplyFileState.notAvailable
		constructor(data: string[]) {
			if (data.length != 10) {
				throw `unknown ApplyDownloadRecord: ${data}`
			}
			this.xh = data[1]
			this.sqsj = data[2]
			switch (data[3]) {
				case '增值税专用发票':
					this.fplx = InvoiceType.vatSpecial
					break
				case '机动车销售统一发票':
					this.fplx = InvoiceType.motorVehicleSales
					break
				case '增值税普通发票':
					this.fplx = InvoiceType.vatNormal
					break
				case '增值税普通发票（电子）':
					this.fplx = InvoiceType.vatNormaltElectronic
					break
				case '增值税普通发票（卷票）':
					this.fplx = InvoiceType.vatNormalVolume
					break
				case '二手车销售统一发票':
					this.fplx = InvoiceType.usedCars
					break
				case '增值税专用发票（电子）':
					this.fplx = InvoiceType.vatSpecialElectronic
					break
				case '道路通行费电子普通发票':
					this.fplx = InvoiceType.roadToll
					break
				default: this.fplx = InvoiceType.customsPayment
			}
			this.kprqq = data[4]
			this.kprqz = data[5]
			if (data[6] == '进项票') {
				this.sjly = SJLY.j
			} else {
				this.sjly = SJLY.x
			}
			this.lsh = data[9]
			if (data[7] == '处理完成') {
				this.state = ApplyDownloadState.completed
			} else {
				this.state = ApplyDownloadState.waiting
				this.fileState = ApplyFileState.unkonwn
				return
			}
			this.downloadHtml = data[8]

			if (this.downloadHtml == '不存在符合条件的发票') {
				this.fileState = ApplyFileState.notAvailable
				return
			}
			if (this.downloadHtml == '文件已过期') {
				this.fileState = ApplyFileState.expired
				return
			}
			const arr = this.downloadHtml.match(/loadfp\(([^)]*)\)/gi)
			if (arr) {
				this.fileState = ApplyFileState.available
				this.downloadHtml = data[8]
				// const files = arr[0].replace(/\(|\)|'|"|loadfp/gi, '').split('=')
				// this.filePath = files[0]
				// this.fileName = this.filePath.split('/').pop()
				// this.fileState = ApplyFileState.available
			}
		}
	}

}
