// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace ServerReponse {
	export interface Invoice {
		invoiceId: number,
		fpdm: string,
		fphm: string,
		kprq: string,
		fpzt: number,
		xfsh: string,
		xfmc: string,
		xfdzdh: string,
		xfyhzh: string,
		gfsh: string,
		gfmc: string,
		gfdzdh: string,
		gfyhzh: string,
		je: number,
		se: number,
		jshj: number,
		jym: string,
		bz: string,
		kpr: string,
		skr: string,
		fhr: string,
		yxse: number,
		fplx: string,
		gxzt: number,
		gxsj: string,
		glzt: number,
		gxyt: number,
		mxbj: number, // 0 无明细 1 有明细
		khsh: string,
		ssq: string,
		sfzhzzhm: string,
		cllx: string,
		cpxh: string,
		cd: string,
		hgzh: string,
		jkzmsh: string,
		sjdh: string,
		fdjhm: string,
		clsbhclhm: string,
		dh: string,
		dz: string,
		zh: string,
		khyh: string,
		slv: string,
		zgswjg: string,
		zgswjgdm: string,
		wspzhm: string,
		dw: string,
		xcrs: string,
		jqbh: string,
		jdhm: string,
		mmq: string,
		createTime: string,
		modifyTime: string,
		delFlag: number
	}

	export interface IncomeRecords {
		records: Array<Invoice>
		total: number
		size: number
		current: number
		orders: Array<any>
		searchCount: true
		pages: number
	}
	export interface OutputRecords {
		list: Array<Invoice>
		total: number
		size: number
		pageSize: number
		pageNum: number
		pages: number
		orders: Array<any>
	}
	export interface SumUpData {
		hjfpfssum: number // 合计发票份数总和
		hjjesum: number // 合计金额总和
		hjsesum: number //合计税额总和
		jshjjesum: number // 价税合计金额总和
	}
}
